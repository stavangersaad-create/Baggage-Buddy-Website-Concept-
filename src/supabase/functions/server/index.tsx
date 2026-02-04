import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5cdb4afc/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-5cdb4afc/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Auto-confirm email since email server not configured
    });

    if (error) {
      console.log('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Sign up exception:', error);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// Get all airline listings
app.get("/make-server-5cdb4afc/listings", async (c) => {
  try {
    const listings = await kv.getByPrefix('listing:');
    return c.json({ listings });
  } catch (error) {
    console.log('Get listings error:', error);
    return c.json({ error: 'Failed to fetch listings' }, 500);
  }
});

// Create a new airline listing (admin only)
app.post("/make-server-5cdb4afc/listings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const listing = await c.req.json();
    const listingId = `listing:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(listingId, {
      ...listing,
      id: listingId,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    });

    return c.json({ success: true, id: listingId });
  } catch (error) {
    console.log('Create listing error:', error);
    return c.json({ error: 'Failed to create listing' }, 500);
  }
});

// Update an airline listing (admin only)
app.put("/make-server-5cdb4afc/listings/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const listingId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`listing:${listingId}`);
    if (!existing) {
      return c.json({ error: 'Listing not found' }, 404);
    }

    await kv.set(`listing:${listingId}`, {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Update listing error:', error);
    return c.json({ error: 'Failed to update listing' }, 500);
  }
});

// Delete an airline listing (admin only)
app.delete("/make-server-5cdb4afc/listings/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const listingId = c.req.param('id');
    await kv.del(`listing:${listingId}`);

    return c.json({ success: true });
  } catch (error) {
    console.log('Delete listing error:', error);
    return c.json({ error: 'Failed to delete listing' }, 500);
  }
});

// Create a booking
app.post("/make-server-5cdb4afc/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized - please sign in' }, 401);
    }

    const booking = await c.req.json();
    const bookingId = `booking:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(bookingId, {
      ...booking,
      id: bookingId,
      userId: user.id,
      userEmail: user.email,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    });

    return c.json({ success: true, bookingId, booking: {
      ...booking,
      id: bookingId,
      userId: user.id,
      userEmail: user.email,
      status: 'confirmed',
    }});
  } catch (error) {
    console.log('Create booking error:', error);
    return c.json({ error: 'Failed to create booking' }, 500);
  }
});

// Get all bookings (admin only)
app.get("/make-server-5cdb4afc/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const bookings = await kv.getByPrefix('booking:');
    return c.json({ bookings });
  } catch (error) {
    console.log('Get bookings error:', error);
    return c.json({ error: 'Failed to fetch bookings' }, 500);
  }
});

// Amadeus Flight Search API
app.post("/make-server-5cdb4afc/api/flights/search", async (c) => {
  try {
    const { origin, destination, departureDate } = await c.req.json();
    
    console.log('Flight search request:', { origin, destination, departureDate });

    // Get Amadeus API credentials
    const clientId = Deno.env.get('AMADEUS_API_KEY');
    const clientSecret = Deno.env.get('AMADEUS_API_SECRET');

    let flights = [];
    let isDemo = false;

    // Try to fetch from Amadeus API
    if (clientId && clientSecret) {
      try {
        // Get access token
        const tokenResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;

          // Search for flights
          const searchUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1&max=5`;
          
          const flightResponse = await fetch(searchUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (flightResponse.ok) {
            const flightData = await flightResponse.json();
            
            // Transform Amadeus data to our format
            if (flightData.data && flightData.data.length > 0) {
              flights = flightData.data.map((offer: any) => {
                const segment = offer.itineraries[0].segments[0];
                const price = parseFloat(offer.price.total);
                
                return {
                  id: offer.id,
                  type: 'live',
                  airline: segment.carrierCode,
                  airlineName: segment.carrierCode, // Can map to full names
                  flightNumber: `${segment.carrierCode}${segment.number}`,
                  origin: segment.departure.iataCode,
                  destination: segment.arrival.iataCode,
                  departure: segment.departure.at,
                  arrival: segment.arrival.at,
                  price: price,
                  availableCapacity: Math.floor(Math.random() * 15) + 5, // Mock capacity
                };
              });

              // Cache the offers in database
              const cacheKey = `flight-cache:${origin}-${destination}-${departureDate}`;
              await kv.set(cacheKey, {
                flights,
                cachedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min expiry
              });
            }
          }
        }
      } catch (apiError) {
        console.log('Amadeus API error:', apiError);
      }
    }

    // If no flights from API, create demo flight
    if (flights.length === 0) {
      console.log('No live flights found, creating demo flight');
      isDemo = true;

      // Map of realistic airlines for routes
      const airlineMap: any = {
        'OSL-FRA': { airline: 'LH', name: 'Lufthansa', logo: '🇩🇪' },
        'FRA-OSL': { airline: 'LH', name: 'Lufthansa', logo: '🇩🇪' },
        'LHR-JFK': { airline: 'BA', name: 'British Airways', logo: '🇬🇧' },
        'JFK-LHR': { airline: 'BA', name: 'British Airways', logo: '🇬🇧' },
        'LAX-NRT': { airline: 'UA', name: 'United Airlines', logo: '🇺🇸' },
        'default': { airline: 'AA', name: 'American Airlines', logo: '🇺🇸' },
      };

      const routeKey = `${origin}-${destination}`;
      const airlineInfo = airlineMap[routeKey] || airlineMap['default'];

      // Create realistic departure/arrival times
      const depDate = new Date(departureDate);
      depDate.setHours(10, 30, 0, 0); // 10:30 AM departure
      
      const arrDate = new Date(depDate);
      arrDate.setHours(arrDate.getHours() + 2.5); // 2.5 hour flight

      const demoFlight = {
        id: `demo-${Date.now()}`,
        type: 'demo',
        airline: airlineInfo.airline,
        airlineName: airlineInfo.name,
        flightNumber: `${airlineInfo.airline}${Math.floor(Math.random() * 900) + 100}`,
        origin,
        destination,
        departure: depDate.toISOString(),
        arrival: arrDate.toISOString(),
        price: 150,
        availableCapacity: 12,
        logo: airlineInfo.logo,
      };

      flights = [demoFlight];
    }

    return c.json({ 
      flights, 
      isDemo,
      searchParams: { origin, destination, departureDate } 
    });
  } catch (error) {
    console.log('Flight search error:', error);
    return c.json({ error: 'Failed to search flights' }, 500);
  }
});

Deno.serve(app.fetch);