import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

// ---- Your real Client ID from Google Cloud Console ----
const GOOGLE_CLIENT_ID = "210870228697-829ld21gkfuvk60moigoonl55jrn6dql.apps.googleusercontent.com";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar.events";

// Format a JS Date as YYYY-MM-DD for Google's all-day event fields
export const toDateOnly = (d) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date.toISOString().split("T")[0];
};

export const addDaysToDateOnly = (dateOnlyStr, days) => {
    const d = new Date(dateOnlyStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return toDateOnly(d);
};

const GoogleCalendarContext = createContext(null);

export function GoogleCalendarProvider({ children }) {
    const [googleToken, setGoogleToken] = useState(null);
    const [googleError, setGoogleError] = useState(null);
    const tokenClientRef = useRef(null);

    useEffect(() => {
        const scriptId = "google-identity-services";

        const initTokenClient = () => {
            if (!window.google) return;
            tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: GOOGLE_SCOPE,
                prompt: "select_account",
                callback: (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        setGoogleToken(tokenResponse.access_token);
                        setGoogleError(null);
                    }
                },
                error_callback: (err) => {
                    console.error("Google auth error:", err);
                    setGoogleError("Couldn't connect to Google Calendar. Please try again.");
                },
            });
        };

        if (document.getElementById(scriptId)) {
            initTokenClient();
            return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initTokenClient;
        document.body.appendChild(script);
    }, []);

    const connect = useCallback(() => {
        if (tokenClientRef.current) {
            tokenClientRef.current.requestAccessToken();
        } else {
            setGoogleError("Google sign-in is still loading, try again in a moment.");
        }
    }, []);

    const disconnect = useCallback(() => {
        if (googleToken && window.google) {
            window.google.accounts.oauth2.revoke(googleToken, () => {});
        }
        setGoogleToken(null);
    }, [googleToken]);

    const apiRequest = useCallback(
        async (path, options = {}) => {
            if (!googleToken) return null;
            const res = await fetch(`https://www.googleapis.com/calendar/v3/${path}`, {
                ...options,
                headers: {
                    Authorization: `Bearer ${googleToken}`,
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
            });

            if (!res.ok) {
                if (res.status === 401) {
                    setGoogleToken(null);
                    setGoogleError("Your Google Calendar session expired. Please reconnect.");
                }
                throw new Error(`Google Calendar API error: ${res.status}`);
            }

            if (res.status === 204) return null;
            return res.json();
        },
        [googleToken]
    );

    // Creates an all-day event, returns its Google event id (or null if not connected / on failure)
    const createEvent = useCallback(
        async (title, dateOnlyStr, extraProps = {}) => {
            if (!googleToken) return null;
            try {
                const event = await apiRequest("calendars/primary/events", {
                    method: "POST",
                    body: JSON.stringify({
                        summary: title,
                        start: { date: dateOnlyStr },
                        end: { date: addDaysToDateOnly(dateOnlyStr, 1) },
                        ...extraProps,
                    }),
                });
                return event?.id || null;
            } catch (err) {
                console.error("Error creating Google Calendar event:", err);
                return null;
            }
        },
        [googleToken, apiRequest]
    );

    const updateEvent = useCallback(
        async (eventId, patch) => {
            if (!googleToken || !eventId) return;
            try {
                await apiRequest(`calendars/primary/events/${eventId}`, {
                    method: "PATCH",
                    body: JSON.stringify(patch),
                });
            } catch (err) {
                console.error("Error updating Google Calendar event:", err);
            }
        },
        [googleToken, apiRequest]
    );

    const value = {
        googleToken,
        isConnected: !!googleToken,
        googleError,
        connect,
        disconnect,
        createEvent,
        updateEvent,
    };

    return <GoogleCalendarContext.Provider value={value}>{children}</GoogleCalendarContext.Provider>;
}

export function useGoogleCalendar() {
    const ctx = useContext(GoogleCalendarContext);
    if (!ctx) {
        throw new Error("useGoogleCalendar must be used inside a <GoogleCalendarProvider>");
    }
    return ctx;
}
