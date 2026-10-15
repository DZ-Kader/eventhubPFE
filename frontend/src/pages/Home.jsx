import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Grid, Calendar as CalendarIcon, ArrowRight, Building, PlusCircle } from "lucide-react";
import { Button, Input, Select, Card, Badge } from "../components/ui";
import API from "../services/api";

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search form state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured events
        const featuredRes = await API.get("/events?isFeatured=true&limit=3");
        setFeaturedEvents(featuredRes.data.events || []);

        // Fetch upcoming events (published events, page 1, sorted by date)
        const upcomingRes = await API.get("/events?limit=4");
        setUpcomingEvents(upcomingRes.data.events || []);

        // Fetch categories
        const catRes = await API.get("/categories");
        setCategories(catRes.data || []);

        // Fetch cities
        const cityRes = await API.get("/cities");
        setCities(cityRes.data || []);
      } catch (err) {
        console.error("Error loading homepage data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (searchCity) params.append("city", searchCity);
    if (searchCategory) params.append("category", searchCategory);
    navigate(`/discover?${params.toString()}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-950 py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-slate-950/60 bg-gradient-to-t from-slate-950 to-transparent"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="text-primary border-primary/50 mb-6 bg-primary/10">The Event Hub of Algeria</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Discover Professional Events<br />Across Algeria
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Find exhibitions, trade fairs, conferences, technology events, career opportunities, and business events happening across the country.
          </p>
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-xl sm:p-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events, topics..." 
                  className="pl-10 h-12 border-0 shadow-none focus-visible:ring-0 bg-transparent text-base text-slate-100" 
                />
              </div>
              <div className="hidden w-px bg-slate-800 sm:block"></div>
              <div className="relative w-full sm:w-48">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Select 
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="pl-10 h-12 border-0 shadow-none focus-visible:ring-0 bg-transparent text-base text-slate-100 w-full"
                >
                  <option value="">Any City</option>
                  {cities.map(c => <option key={c._id} value={c.slug} className="bg-slate-900">{c.name}</option>)}
                </Select>
              </div>
              <div className="hidden w-px bg-slate-800 sm:block"></div>
              <div className="relative w-full sm:w-48">
                <Grid className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Select 
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="pl-10 h-12 border-0 shadow-none focus-visible:ring-0 bg-transparent text-base text-slate-100 w-full"
                >
                  <option value="">Any Category</option>
                  {categories.map(c => <option key={c._id} value={c.slug} className="bg-slate-900">{c.name}</option>)}
                </Select>
              </div>
              <Button type="submit" size="lg" className="h-12 w-full sm:w-auto px-8 shrink-0">
                Discover
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">Featured Events</h2>
              <p className="mt-2 text-slate-400">Don't miss these premium professional gatherings.</p>
            </div>
            <Link to="/discover" className="hidden text-sm font-semibold text-primary hover:text-primary-hover sm:flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse bg-slate-900 rounded-[32px] h-96 border border-slate-800"></div>
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {featuredEvents.map((event) => (
                <Link key={event._id} to={`/events/${event.slug || event._id}`}>
                  <Card className="overflow-hidden group hover:shadow-md transition-shadow h-full flex flex-col hover:border-primary/40">
                    <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                      <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="default" className="bg-slate-900/90 text-slate-100 backdrop-blur-sm">{event.category?.name}</Badge>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-sm text-primary font-medium mb-3">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h3 className="text-xl font-bold text-slate-100 mb-2 line-clamp-2">{event.title}</h3>
                      <div className="mt-auto space-y-2 text-sm text-slate-400 pt-4 border-t border-slate-800/60">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-primary" />
                          <span className="truncate">{event.city?.name} - {event.venue?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 shrink-0 text-slate-500" />
                          <span className="truncate">{event.organizer?.name}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
              No featured events at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Browse by Category Section */}
      <section className="py-20 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">Browse by Category</h2>
            <p className="mt-2 text-slate-400">Find events tailored to your industry.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((category) => (
              <Link key={category._id} to={`/discover?category=${category.slug}`} className="group relative rounded-[32px] border border-border p-6 text-center hover:border-primary/50 hover:bg-slate-850 transition-all duration-200">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-slate-950 transition-colors">
                  <Grid className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-100">{category.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">Upcoming Events</h2>
              <p className="mt-2 text-slate-400">The next professional opportunities around Algeria.</p>
            </div>
            <Link to="/discover" className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="animate-pulse bg-slate-900 rounded-[32px] h-80 border border-slate-800"></div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {upcomingEvents.map((event) => (
                <Link key={event._id} to={`/events/${event.slug || event._id}`}>
                  <Card className="overflow-hidden group hover:shadow-md transition-shadow h-full flex flex-col hover:border-primary/30">
                    <div className="relative h-40 w-full overflow-hidden bg-slate-800">
                      <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute top-3 left-3">
                        <Badge variant="default" className="bg-slate-900/90 text-xs text-slate-100">{event.category?.name}</Badge>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-xs text-primary font-semibold mb-1 uppercase tracking-wide">
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <h3 className="font-bold text-slate-100 text-sm mb-2 line-clamp-2 flex-1 leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                      <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{event.city?.name}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
              No upcoming events found.
            </div>
          )}
        </div>
      </section>

      {/* Explore by City Section */}
      <section className="py-20 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">Explore by City</h2>
            <p className="mt-2 text-slate-400">Discover events taking place in different regions.</p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
            {cities.map((city) => (
              <Link key={city._id} to={`/discover?city=${city.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[4/5] border border-border">
                <img src={city.image} alt={city.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-primary transition-colors">{city.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{city.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How EVENTORIA Works Section */}
      <section className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">How EVENTORIA Works</h2>
            <p className="mt-2 text-slate-400">Our platform simplifies networking and event discovery in 3 easy steps.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-8 rounded-[32px] bg-slate-900 border border-slate-800 text-center relative hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Find Events</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Browse through our categories like technology, agriculture, solar energy, or finance to discover interesting local gatherings.
              </p>
            </div>
            <div className="p-8 rounded-[32px] bg-slate-900 border border-slate-800 text-center relative hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Register Instantly</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Click register on internal events to lock in your seat and receive a virtual ticket code, or redirect to external hosts.
              </p>
            </div>
            <div className="p-8 rounded-[32px] bg-slate-900 border border-slate-800 text-center relative hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Attend & Network</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Present your ticket code to organizer teams at check-in, join discussions, and meet leaders in your profession.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action for Organizers */}
      <section className="py-24 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-primary/10 px-6 py-16 sm:p-16 text-center border border-primary/20 relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-primary/20 blur-[80px] rounded-full"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">Organizing a Professional Event?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
                Join Algeria's premier event network. Publish, manage, and promote your business events, trade fairs, and conferences to a targeted professional audience.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button size="lg" className="bg-blue-500 text-slate-950 hover:bg-blue-400 border-transparent shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer" asChild>
                  <Link to="/organizer/events/new">Create Your Event</Link>
                </Button>
                <Button size="lg" variant="outline" className="cursor-pointer" asChild>
                  <Link to="/organizer">Organizer Portal</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
