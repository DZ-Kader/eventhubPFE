import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, MapPin, Building, Share2, Heart, ExternalLink, ShieldCheck, Clock, CheckCircle } from "lucide-react";
import { Button, Card, Badge } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function EventDetails() {
  const { slug, id } = useParams();
  const eventParam = slug || id;
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Registration state
  const [registering, setRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  // Favorites state
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError("");
      setRegistrationSuccess(null);
      setIsRegistered(false);
      try {
        const res = await API.get(`/events/${eventParam}`);
        setEvent(res.data.event);
        setRelatedEvents(res.data.related || []);

        if (user) {
          try {
            const regRes = await API.get("/registrations/my");
            const userRegs = regRes.data || [];
            const registered = userRegs.find(r => r.event?._id === res.data.event._id);
            if (registered) {
              setIsRegistered(true);
              setRegistrationSuccess(registered.ticketCode);
            }
          } catch (regErr) {
            console.error("Error loading user registrations:", regErr);
          }
        }
      } catch (err) {
        console.error("Error loading event:", err);
        setError("Could not load event details. Please verify the URL.");
      } finally {
        setLoading(false);
      }
    };

    if (eventParam) {
      fetchEvent();
    }
  }, [eventParam, user]);

  useEffect(() => {
    if (user && event) {
      setIsFavorite(user.favorites?.some(favId => 
        (typeof favId === 'object' ? favId._id : favId) === event._id
      ));
    }
  }, [user, event]);

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (event.registrationType === "external") {
      window.open(event.externalRegistrationLink, "_blank");
      return;
    }

    setRegistering(true);
    setError("");
    try {
      const res = await API.post("/registrations", { eventId: event._id });
      setRegistrationSuccess(res.data.ticketCode);
      setIsRegistered(true);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      let updatedFavs;
      if (isFavorite) {
        const res = await API.delete(`/favorites/${event._id}`);
        updatedFavs = res.data.favorites;
      } else {
        const res = await API.post(`/favorites/${event._id}`);
        updatedFavs = res.data.favorites;
      }

      if (updateProfile) {
        updateProfile({
          ...user,
          favorites: updatedFavs
        });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Event link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-slate-400">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-rose-500">Event Not Found</h2>
        <p className="mt-2 text-slate-400">{error || "The requested event could not be found."}</p>
        <Link to="/discover">
          <Button className="mt-6">Back to Discover</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background pb-20 text-slate-100">
      {/* Hero Header */}
      <div className="relative h-64 md:h-96 w-full bg-slate-950">
        <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <Badge variant="outline" className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-md">
              {event.category?.name || "General"}
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl leading-tight">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          
          {/* Main Content */}
          <div className="flex-1 space-y-10">
            {/* Quick Info Bar Mobile */}
            <div className="lg:hidden flex flex-col gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <CalendarIcon className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="font-semibold">{new Date(event.startDate).toLocaleDateString()}</p>
                  <p className="text-xs text-slate-500">{event.startTime} - {event.endTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="font-semibold">{event.venue?.name}</p>
                  <p className="text-xs text-slate-500">{event.city?.name}</p>
                </div>
              </div>
            </div>

            {/* About */}
            <section>
              <h2 className="text-2xl font-bold text-slate-100 mb-4">About This Event</h2>
              <div className="prose prose-invert max-w-none text-slate-400 space-y-4 text-base leading-relaxed">
                <p className="text-slate-200 text-lg font-medium">{event.shortDescription}</p>
                <p className="whitespace-pre-line text-slate-300">{event.description}</p>
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="text-2xl font-bold text-slate-100 mb-4">Location & Venue</h2>
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 h-64 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="relative bg-slate-950/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg max-w-sm text-center border border-slate-800">
                  <MapPin className="h-6 w-6 text-indigo-400 mx-auto mb-2" />
                  <p className="font-bold text-slate-100">{event.venue?.name}</p>
                  <p className="text-sm text-slate-400 mt-1">{event.venue?.address || event.address || "Algeria"}, {event.city?.name}</p>
                </div>
              </div>
            </section>

            {/* Organizer */}
            <section>
              <h2 className="text-2xl font-bold text-slate-100 mb-4">Organizer</h2>
              <Card className="p-6 flex items-start gap-4 bg-slate-900 border-slate-800">
                <img src={event.organizer?.profileImage || "https://api.dicebear.com/7.x/initials/svg?seed=Org"} alt={event.organizer?.name} className="h-14 w-14 rounded-xl border border-slate-800 bg-slate-950" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-100">{event.organizer?.name || "TechDZ Events"}</h3>
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Verified Event Organizer on Eventoria</p>
                  <p className="text-xs text-slate-500 mt-1">Contact: {event.organizer?.phone || "+213 555 00 11 22"}</p>
                </div>
              </Card>
            </section>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <section className="pt-6 border-t border-slate-800/80">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">Related Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedEvents.map((ev) => (
                    <Link key={ev._id} to={`/event/${ev.slug || ev._id}`}>
                      <Card className="overflow-hidden group bg-slate-900 border-slate-800 hover:border-indigo-500/40 transition">
                        <div className="relative h-32 w-full overflow-hidden bg-slate-950">
                          <img src={ev.coverImage} alt="" className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h4 className="font-bold text-slate-200 text-sm line-clamp-2 leading-tight group-hover:text-indigo-400 transition">{ev.title}</h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80 mt-2">
                            <MapPin className="h-3 w-3 text-indigo-400 shrink-0" />
                            <span className="truncate">{ev.city?.name}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              <Card className="p-6 border-slate-800 bg-slate-900/90 backdrop-blur-xl">
                <div className="space-y-6">
                  <div>
                    <p className="text-3xl font-extrabold text-slate-100">
                      {event.registrationType === "none" ? "Free Entry" : "Register Pass"}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Access: <span className="capitalize text-slate-200">{event.eventType}</span>
                    </p>
                  </div>

                  {registrationSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-400" />
                      <p className="font-bold text-sm">You are registered!</p>
                      <p className="text-xs text-slate-300 mt-1">Digital Reference Ticket Code:</p>
                      <p className="font-mono text-base font-bold bg-slate-950 p-2 rounded-lg mt-2 tracking-wider text-indigo-300 border border-slate-800">{registrationSuccess}</p>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400">
                      {error}
                    </div>
                  )}

                  {event.registrationType !== "none" && !registrationSuccess && (
                    <button
                      onClick={handleRegister} 
                      disabled={registering || (event.status !== "published")} 
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-indigo-600/25 cursor-pointer disabled:opacity-50"
                    >
                      {registering ? "Registering Pass..." : event.registrationType === "external" ? "Register Externally" : "Register Now"}
                    </button>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleToggleFavorite} 
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                        isFavorite
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current text-rose-400" : "text-slate-400"}`} /> {isFavorite ? "Saved" : "Save"}
                    </button>
                    <button onClick={handleShare} className="flex-1 py-2 px-3 bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition">
                      <Share2 className="h-4 w-4 text-slate-400" /> Share
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 space-y-4 text-slate-300">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-200">Date</p>
                      <p className="text-sm">
                        {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-200">Time</p>
                      <p className="text-sm">{event.startTime} - {event.endTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-200">Venue</p>
                      <p className="text-sm">{event.venue?.name}</p>
                      <p className="text-xs text-slate-500">{event.city?.name}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {event.registrationType === "external" && (
                <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-100 font-semibold mb-2">
                    <ExternalLink className="h-4 w-4 text-indigo-400" /> Official Website
                  </div>
                  <a href={event.externalRegistrationLink} target="_blank" rel="noreferrer" className="text-sm text-indigo-400 hover:underline flex items-center gap-1">
                    Visit External Portal <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
