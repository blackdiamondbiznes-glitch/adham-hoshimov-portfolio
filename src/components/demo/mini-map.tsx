import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pin = L.divIcon({
  className: "bd-pin",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function ClickPick({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function FixSize() {
  const map = useMap();
  useEffect(() => {
    const id = window.setTimeout(() => map.invalidateSize(), 60);
    return () => window.clearTimeout(id);
  }, [map]);
  return null;
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 0.4 });
  }, [lat, lng, map]);
  return null;
}

async function placeName(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=uz`,
      { signal: AbortSignal.timeout(4000) },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { display_name?: string };
    return data.display_name ?? null;
  } catch {
    return null;
  }
}

export function MapPicker({
  lat,
  lng,
  onClose,
  onConfirm,
}: {
  lat: number | null;
  lng: number | null;
  onClose: () => void;
  onConfirm: (lat: number, lng: number, address: string | null) => void;
}) {
  const [point, setPoint] = useState(lat != null && lng != null ? { lat, lng } : null);
  const [jump, setJump] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const center = useMemo<[number, number]>(() => [lat ?? 41.311081, lng ?? 69.240562], [lat, lng]);

  async function confirm() {
    if (!point) return;
    setBusy(true);
    const address = await placeName(point.lat, point.lng);
    setBusy(false);
    onConfirm(point.lat, point.lng, address);
  }

  function current() {
    if (!navigator.geolocation) {
      setError("Bu qurilmada joy aniqlanmadi. Xaritani bosing.");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPoint({ lat: position.coords.latitude, lng: position.coords.longitude });
        setJump((value) => value + 1);
        setBusy(false);
      },
      () => {
        setBusy(false);
        setError("Joy olinmadi. Xaritani bosib nuqta qo'ying.");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <div className="bd-sheet">
      <h2>Xaritadan belgilash</h2>
      <div className="bd-map">
        <MapContainer
          center={center}
          zoom={point ? 15 : 12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />
          <FixSize />
          <ClickPick onPick={(nextLat, nextLng) => setPoint({ lat: nextLat, lng: nextLng })} />
          {point && jump > 0 ? <FlyTo lat={point.lat} lng={point.lng} /> : null}
          {point ? (
            <Marker
              position={[point.lat, point.lng]}
              icon={pin}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const next = event.target.getLatLng();
                  setPoint({ lat: next.lat, lng: next.lng });
                },
              }}
            />
          ) : null}
        </MapContainer>
      </div>
      <p className="bd-muted">Xaritani bosing yoki nuqtani suring.</p>
      {point ? (
        <p className="bd-muted">
          {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
        </p>
      ) : null}
      {error ? <p className="bd-ember">{error}</p> : null}
      <button type="button" className="bd-ghost" onClick={current} disabled={busy}>
        Joriy joyimni olish
      </button>
      <div className="ops-row" style={{ marginTop: 8 }}>
        <button type="button" className="bd-ghost" onClick={onClose}>
          Bekor
        </button>
        <button
          type="button"
          className="primary"
          disabled={!point || busy}
          onClick={() => void confirm()}
        >
          {busy ? "..." : "Tanlash"}
        </button>
      </div>
    </div>
  );
}
