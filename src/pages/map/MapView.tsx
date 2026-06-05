import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, TileLayer } from 'react-leaflet';
import type { Store } from '../../types';
import { StoreMarker } from './StoreMarker';

// Fix Leaflet default icon issue with Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

interface MapViewProps {
  stores: Store[];
  center: [number, number];
  zoom: number;
}

export function MapView({ stores, center, zoom }: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stores.map((store) => (
        <StoreMarker key={store.id} store={store} />
      ))}
    </MapContainer>
  );
}
