// import { useEffect, useRef } from "react";

// const MapModal = ({ isOpen, onClose }) => {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     if (!isOpen) return;

//     // Check if SDK loaded
//     if (!window.mappls || !window.mappls.Map || !window.mappls.Marker) {
//       console.error("❌ Mappls SDK not loaded.");
//       return;
//     }

//     const tvmLat = 8.5241;
//     const tvmLng = 76.9366;

//     console.log("✅ Initializing map at TVM:", tvmLat, tvmLng);

//     const newMap = new window.mappls.Map({
//       id: "map-container",
//       center: [tvmLat, tvmLng],
//       zoom: 14,
//       // Optional: disable default controls for clean UI
//       zoomControl: true,
//     });

//     newMap.on("load", () => {
//       console.log("✅ Map loaded. Adding marker.");

//       new window.mappls.Marker({
//         map: newMap,
//         position: { lat: tvmLat, lng: tvmLng },
//         popupHtml: "Thiruvananthapuram",
//         draggable: false,
//       });
//     });

//     mapRef.current = newMap;

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove();
//         mapRef.current = null;
//       }
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         zIndex: 1000,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <div
//         style={{
//           background: "white",
//           borderRadius: "10px",
//           padding: "1rem",
//           width: "90%",
//           maxWidth: "600px",
//           position: "relative",
//         }}
//       >
//         <button
//           onClick={onClose}
//           style={{
//             position: "absolute",
//             right: "12px",
//             top: "8px",
//             fontSize: "18px",
//             background: "transparent",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           ✕
//         </button>
//         <div
//           id="map-container"
//           style={{ width: "100%", height: "80vh", borderRadius: "8px" }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default MapModal;


import { useEffect, useRef, useState } from "react";
import { mappls, mappls_plugin } from "mappls-web-maps";

import { Button } from "@chakra-ui/react";
import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "../Components/dialog.jsx"
import { useQuery } from "@tanstack/react-query";
// import { fetchMapplsAuthToken } from "@/hooks/order/useOrder";
import { useNavigate } from "react-router-dom";

const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

const PlaceSearchPlugin = ({ map }) => {
  const placeSearchRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    if (placeSearchRef.current) {
      mapplsClassObject.removeLayer({ map, layer: placeSearchRef.current });
    }

    const optional_config = {
      location: [8.5892862, 76.8773566], // Center of Trivandrum
      region: "IND",
      height: 300,
      // filter: "bounds:8.2833,76.6833;8.9,77.2833",
      inputQuery: "Thiruvananthapuram",
      hyperLocal: true,
    };

    const callback = (data) => {
      if (!data || !data[0]) return;

      const { eLoc, placeName } = data[0];

      if (markerRef.current) markerRef.current.remove();

      mapplsPluginObject.pinMarker(
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
      markerRef.current.remove();
    };

    placeSearchRef.current = mapplsPluginObject.search(
      document.getElementById("auto"),
      optional_config,
      callback
    );

    return () => {
      if (placeSearchRef.current) {
        mapplsClassObject.removeLayer({ map, layer: placeSearchRef.current });
      }
    };
  }, [map]);

  return null;
};

const MapModal = ({ isOpen, onClose, onLocationSelect, oldLocation = null }) => {
  const markerRefOne = useRef(null);
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const navigate = useNavigate();

  const { data: authToken } = useQuery({
    queryKey: ["get-mappls-token"],
    queryFn: () => fetchMapplsAuthToken(navigate),
    enabled: isOpen,
  });

  const cleanupMap = () => {
    if (markerRefOne.current) {
      markerRefOne.current.remove();
      markerRefOne.current = null;
    }
    if (map) {
      map.remove();
      setMap(null);
    }
  };

  const initializeMap = () => {
    if (!authToken) return;

    cleanupMap();

    mapplsClassObject.initialize(
      authToken,
      { map: true, plugins: ["search"] },
      () => {
        const newMap = mapplsClassObject.Map({
          id: mapContainerRef.current.id,
          properties: {
            center:
              oldLocation?.length === 2
                ? [oldLocation[0], oldLocation[1]]
                : [8.5892862, 76.8773566],
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
            mapplsClassObject.Marker({
              map: newMap,
              position: { lat: oldLocation[0], lng: oldLocation[1] },
              draggable: false,
            });
          }
        });

        newMap.on("click", ({ lngLat: { lat, lng } }) => {
          if (markerRefOne.current) {
            markerRefOne.current.remove();
          }

          const newMarker = mapplsClassObject.Marker({
            map: newMap,
            position: { lat, lng },
            icon: "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Flocation.png?alt=media&token=a3af3a58-a2c9-4eb1-8566-b06df5f14edb",
            width: 35,
            height: 35,
          });

          markerRefOne.current = newMarker;
        });

        setMap(newMap);
      }
    );
  };

  useEffect(() => {
    isOpen ? initializeMap() : cleanupMap();
  }, [isOpen, authToken]);

  const handleCloseMap = () => {
    if (markerRefOne.current) {
      const { lat, lng } = markerRefOne.current.getPosition();
      const location = [lat, lng];
      onLocationSelect(location);
    }
    onClose();
  };

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={handleCloseMap}
      placement="center"
      motionPreset="slide-in-bottom"
      size="xl"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={handleCloseMap} />
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div
            id="map-container"
            ref={mapContainerRef}
            className="h-[500px] relative"
          >
            <input
              type="text"
              id="auto"
              className="mt-2 ms-2 w-[300px] absolute top-0 left-0 text-[15px] p-[10px] outline-none"
              placeholder="Search places"
            />
            {isMapLoaded && <PlaceSearchPlugin map={map} />}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            className="bg-teal-700 py-2 px-4 text-white"
            onClick={handleCloseMap}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default MapModal;
