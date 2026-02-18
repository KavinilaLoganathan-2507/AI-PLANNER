'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { PlaceInfo } from '@/types';

interface MapViewProps {
  places: PlaceInfo[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

export default function MapView({ places, center, zoom = 12 }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) return;

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.importLibrary('maps').then(({ Map }) => {
      // Find center from places if not provided
      const validPlaces = places.filter((p) => p.latitude && p.longitude);
      const mapCenter = center || (validPlaces.length > 0
        ? {
            lat: validPlaces.reduce((s, p) => s + (p.latitude || 0), 0) / validPlaces.length,
            lng: validPlaces.reduce((s, p) => s + (p.longitude || 0), 0) / validPlaces.length,
          }
        : { lat: 0, lng: 0 });

      const map = new Map(mapRef.current!, {
        center: mapCenter,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      // Add markers
      loader.importLibrary('marker').then(({ AdvancedMarkerElement }) => {
        validPlaces.forEach((place, i) => {
          if (!place.latitude || !place.longitude) return;

          const marker = new google.maps.Marker({
            position: { lat: place.latitude, lng: place.longitude },
            map,
            title: place.name,
            label: {
              text: `${i + 1}`,
              color: 'white',
              fontWeight: 'bold',
            },
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">${place.name}</h3>
                ${place.rating ? `<p style="color: #f59e0b;">⭐ ${place.rating}</p>` : ''}
                ${place.address ? `<p style="color: #6b7280; font-size: 12px;">${place.address}</p>` : ''}
              </div>
            `,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });
      }).catch(() => {
        // Fallback to regular markers if AdvancedMarkerElement unavailable
      });

      setMapLoaded(true);
    });
  }, [places, center, zoom]);

  return (
    <div className="relative">
      <div ref={mapRef} className="map-container" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
          <div className="text-center">
            <div className="spinner mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
