import { useEffect, useRef, type ReactNode } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import { fixLeafletIcon } from "@/shared/lib/map/fixLeafletIcon";
import styles from "./Map.module.css";

import pawIconUrl from "./paw-marker.svg";

fixLeafletIcon();

const DEFAULT_CENTER: [number, number] = [53.9006, 27.559];

const pawIcon = L.icon({
    iconUrl: pawIconUrl,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
    className: styles.roundedPawMarker,
});

const ChangeMapCenter = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    const prevCenterRef = useRef<string>("");

    useEffect(() => {
        const centerKey = `${center[0]},${center[1]}`;
        if (prevCenterRef.current === centerKey) return;

        prevCenterRef.current = centerKey;
        map.setView(center, map.getZoom(), { animate: true });
    }, [center, map]);

    return null;
};

interface SharedMapProps {
    center?: [number, number];
    polylinePositions?: [number, number][];
    markerPopupContent?: ReactNode;
    isLoading?: boolean;
}

export const Map = ({
    center,
    polylinePositions = [],
    markerPopupContent,
    isLoading,
}: SharedMapProps) => {
    const mapCenter = center || DEFAULT_CENTER;

    return (
        <div className={styles.mapWrapper}>
            {isLoading && (
                <div className={styles.loader}>Синхронизация координат...</div>
            )}

            <MapContainer
                center={mapCenter}
                zoom={15}
                className={styles.mapContainer}
            >
                {center && <ChangeMapCenter center={center} />}

                <TileLayer
                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {polylinePositions.length > 1 && (
                    <Polyline
                        positions={polylinePositions}
                        pathOptions={{
                            color: "#1e40af",
                            weight: 5,
                            opacity: 0.9,
                            lineCap: "round",
                            lineJoin: "round",
                        }}
                    />
                )}

                {center && (
                    <Marker position={center} icon={pawIcon}>
                        {markerPopupContent && (
                            <Popup>{markerPopupContent}</Popup>
                        )}
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};
