import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, Grid, Calendar as CalendarIcon, SlidersHorizontal, Building } from "lucide-react";
import { Button, Input, Select, Card, Badge } from "../components/ui";
import API from "../services/api";

export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialCity = searchParams.get("city") || "";
  const initialSearch = searchParams.get("search") || "";

  // State
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCities, setSelectedCities] = useState(initialCity ? [initialCity] : []);
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
  const [sortOption, setSortOption] = useState("Date");

  // Mobile Filters toggle
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    // Load categories & cities
    const loadFiltersData = async () => {
      try {
        const catRes = await API.get("/categories");
        setCategories(catRes.data || []);
        
        const cityRes = await API.get("/cities");
        setCities(cityRes.data || []);
      } catch (err) {
        console.error("Error loading filter lists:", err);
      }
    };
    loadFiltersData();
  }, []);

  // Sync state with URL params changes
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    const urlCity = searchParams.get("city");
    const urlCat = searchParams.get("category");
    setSelectedCities(urlCity ? [urlCity] : []);
    setSelectedCategories(urlCat ? [urlCat] : []);
  }, [searchParams]);

  // Fetch events on filters / sorting changes
  useEffect(() => {
    const fetchFilteredEvents = async () => {
      setLoading(true);
      try {
        // Construct API query parameters
        const params = new URLSearchParams();
        params.append("status", "published");
        if (searchTerm) params.append("search", searchTerm);
        
        // Handle city/category params (backend accepts single or resolved filters)
        if (selectedCities.length > 0) {
          params.append("city", selectedCities[0]); // PFE keeps filtering simple
        }
        if (selectedCategories.length > 0) {
          params.append("category", selectedCategories[0]);
        }

        const res = await API.get(`/events?${params.toString()}`);
        setEvents(res.data.events || []);
      } catch (err) {
        console.error("Error searching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredEvents();
  }, [searchTerm, selectedCities, selectedCategories, sortOption]);

  const handleCityToggle = (citySlug) => {
    if (selectedCities.includes(citySlug)) {
      setSelectedCities([]);
      // Update URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("city");
      setSearchParams(newParams);
    } else {
      setSelectedCities([citySlug]);
      const newParams = new URLSearchParams(searchParams);
      newParams.set("city", citySlug);
      setSearchParams(newParams);
    }
  };

  const handleCategoryToggle = (catSlug) => {
    if (selectedCategories.includes(catSlug)) {
      setSelectedCategories([]);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("category");
      setSearchParams(newParams);
    } else {
      setSelectedCategories([catSlug]);
      const newParams = new URLSearchParams(searchParams);
      newParams.set("category", catSlug);
      setSearchParams(newParams);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCities([]);
    setSelectedCategories([]);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header & Top Search */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Discover Events</h1>
          <p className="text-slate-400 mt-1">Found {events.length} professional events in Algeria.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords..." 
              className="pl-9" 
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} 
            className="shrink-0 md:hidden cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="hidden md:block w-40"
          >
            <option>Sort by Date</option>
            <option>Sort by Popularity</option>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block space-y-6">
          <div>
            <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Wilaya (City)</h3>
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
              {cities.map(city => (
                <label key={city._id} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedCities.includes(city.slug)}
                    onChange={() => handleCityToggle(city.slug)}
                    className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary h-4 w-4 cursor-pointer" 
                  />
                  <span className="text-sm text-slate-300 group-hover:text-slate-100">{city.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="border-t border-border pt-6">
            <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Category</h3>
            <div className="mt-3 space-y-2">
              {categories.map(category => (
                <label key={category._id} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(category.slug)}
                    onChange={() => handleCategoryToggle(category.slug)}
                    className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary h-4 w-4 cursor-pointer" 
                  />
                  <span className="text-sm text-slate-300 group-hover:text-slate-100">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <Button variant="outline" onClick={handleResetFilters} className="w-full cursor-pointer">
              Reset Filters
            </Button>
          </div>
        </aside>

        {/* Mobile Filters Drawer Overlay */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)}>
            <div className="ml-auto w-72 bg-slate-900 p-6 border-l border-border h-full flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h2 className="font-bold text-slate-100">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setMobileFiltersOpen(false)}>Close</Button>
              </div>
              <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">City</h3>
                  <div className="mt-3 space-y-2">
                    {cities.map(city => (
                      <label key={city._id} className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={selectedCities.includes(city.slug)}
                          onChange={() => handleCityToggle(city.slug)}
                          className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary h-4 w-4" 
                        />
                        <span className="text-sm text-slate-300">{city.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Category</h3>
                  <div className="mt-3 space-y-2">
                    {categories.map(category => (
                      <label key={category._id} className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes(category.slug)}
                          onChange={() => handleCategoryToggle(category.slug)}
                          className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary h-4 w-4" 
                        />
                        <span className="text-sm text-slate-300">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <Button variant="outline" onClick={() => { handleResetFilters(); setMobileFiltersOpen(false); }} className="w-full">
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="animate-pulse bg-slate-900 rounded-[32px] h-96 border border-slate-800"></div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <Link key={event._id} to={`/events/${event.slug || event._id}`}>
                  <Card className="overflow-hidden group hover:shadow-md transition-shadow h-full flex flex-col hover:border-primary/30">
                    <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                      <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute top-3 left-3">
                        <Badge variant="default" className="bg-slate-900/90 text-slate-100 backdrop-blur-sm shadow-sm">{event.category?.name}</Badge>
                      </div>
                      {event.price === 0 && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="success" className="shadow-sm">Free</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                      <div className="mt-auto space-y-2 text-sm text-slate-400 pt-4 border-t border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-primary" />
                          <span className="truncate">{event.city?.name}</span>
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
            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/20 border border-slate-800 rounded-[32px]">
              <div className="rounded-full bg-slate-850 p-4 mb-4">
                <Search className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">No events found</h3>
              <p className="mt-1 text-slate-400">Try adjusting your filters or search keywords to find what you're looking for.</p>
              <Button variant="outline" onClick={handleResetFilters} className="mt-6 cursor-pointer">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
