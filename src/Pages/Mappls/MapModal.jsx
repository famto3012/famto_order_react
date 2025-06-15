import { useEffect, useRef, useState } from "react";
import { mappls, mappls_plugin } from "mappls-web-maps";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "../../styles/Common/MapStyles.css";

const mapplsClassObject = new mappls();

// Replace this with your actual fetch function
// import { fetchMapplsAuthToken } from "@/hooks/order/useOrder";
// const fetchMapplsAuthToken = async (navigate) => {
//   // dummy token fetcher
//   return "your_mappls_token";
// };

const PlaceSearchPlugin = ({ map }) => {
  const placeSearchRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    if (placeSearchRef.current) {
      mappls.removeLayer({ map, layer: placeSearchRef.current });
    }

    const config = {
      location: [8.5892862, 76.8773566],
      region: "IND",
      height: 300,
      inputQuery: "Thiruvananthapuram",
      hyperLocal: true,
    };

    const callback = (data) => {
      if (!data || !data[0]) return;

      const { eLoc, placeName } = data[0];

      if (markerRef.current) markerRef.current.remove();

      mappls_plugin.pinMarker(
        {
          map,
          pin: eLoc,
          popupHtml: placeName,
          popupOptions: { openPopup: true },
          zoom: 10,
        },
        (marker) => {
          markerRef.current = marker;
          markerRef.current.fitbounds();
        }
      );
    };

    placeSearchRef.current = mappls_plugin.search(
      document.getElementById("map-input"),
      config,
      callback
    );

    return () => {
      if (placeSearchRef.current) {
        mappls.removeLayer({ map, layer: placeSearchRef.current });
      }
    };
  }, [map]);

  return null;
};

const MapModal = ({ isOpen, onClose, onLocationSelect, oldLocation = null }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const navigate = useNavigate();

  const { data: authToken } = useQuery({
    queryKey: ["mappls-token"],
    queryFn: () => fetchMapplsAuthToken(navigate),
    enabled: isOpen,
  });

  const cleanupMap = () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };

const initializeMap = () => {
  if (!authToken || !mapContainerRef.current) return;

  cleanupMap();

  mapplsClassObject.initialize(authToken, { map: true, plugins: ["search"] }, () => {
    const newMap = mappls.Map({
      id: mapContainerRef.current.id,
      properties: {
        center: oldLocation?.length === 2 ? oldLocation : [8.5892862, 76.8773566],
        draggable: true,
        zoom: 12,
        traffic: true,
        fullscreenControl: true,
        scrollWheel: true,
        zoomControl: true,
      },
    });

    newMap.on("load", () => {
      setIsMapLoaded(true);
      if (oldLocation) {
        mappls.Marker({
          map: newMap,
          position: { lat: oldLocation[0], lng: oldLocation[1] },
          draggable: false,
        });
      }
    });

    newMap.on("click", ({ lngLat: { lat, lng } }) => {
      if (mapRef.current) {
        mapRef.current.remove();
      }

      const marker = mappls.Marker({
        map: newMap,
        position: { lat, lng },
        icon: "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Flocation.png?alt=media&token=9a632cda78b871b3a6eb69bddc470fef",
        width: 35,
        height: 35,
      });

      mapRef.current = marker;
    });

    setMap(newMap);
  }); // ✅ Properly close the mapplsClassObject.initialize call
};


    useEffect(() => {
      isOpen ? initializeMap() : cleanupMap();
    }, [isOpen, authToken]);

    const handleSave = () => {
      if (mapRef.current) {
        const { lat, lng } = mapRef.current.getPosition();
        onLocationSelect({lat, lng});
      }
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "1rem",
          width: "90%",
          maxWidth: "800px",
          position: "relative"
        }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "20px",
              background: "transparent",
              border: "none",
              cursor: "pointer"
            }}
          >✕</button>

          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <input
              id="map-input"
              placeholder="Search places"
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                zIndex: 10,
                width: "300px",
                padding: "10px",
                fontSize: "14px",
                borderRadius: "5px",
                outline: "none"
              }}
            />
            <div
              id="map-container"
              ref={mapContainerRef}
              style={{
                width: "100%",
                height: "500px",
                borderRadius: "8px"
              }}
            />
          </div>

          <button
            onClick={handleSave}
            style={{
              padding: "10px 16px",
              backgroundColor: "teal",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  export default MapModal;
