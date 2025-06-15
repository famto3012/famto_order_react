import { useEffect, useRef, useState } from "react";
import { mappls, mappls_plugin } from "mappls-web-maps";
import { useNavigate } from "react-router-dom";
import "../../styles/Common/MapStyles.css";
import { fetchMapplsAuthToken } from "../../services/Universal_Flow/universalService";

const mapplsClassObject = new mappls();

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
   const markerRefOne = useRef(null);
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const navigate = useNavigate();

  const cleanupMap = () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };


  //   if (!token || !mapContainerRef.current) return;

  //   cleanupMap();

  //   mapplsClassObject.initialize(token, { map: true, plugins: ["search"] }, () => {
  //     const newMap = mappls.Map({
  //       id: "map-container",
  //       properties: {
  //         center: oldLocation?.length === 2 ? oldLocation : [8.5892862, 76.8773566],
  //         draggable: true,
  //         zoom: 12,
  //         traffic: true,
  //         fullscreenControl: true,
  //         scrollWheel: true,
  //         zoomControl: true,
  //       },
  //     });

  //     newMap.on("load", () => {
  //       setIsMapLoaded(true);
  //       if (oldLocation) {
  //         mappls.Marker({
  //           map: newMap,
  //           position: { lat: oldLocation[0], lng: oldLocation[1] },
  //           draggable: false,
  //         });
  //       }
  //     });

  //     newMap.on("click", ({ lngLat: { lat, lng } }) => {
  //       if (mapRef.current) {
  //         mapRef.current.remove();
  //       }

  //       const marker = mappls.Marker({
  //         map: newMap,
  //         position: { lat, lng },
  //         icon: "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Flocation.png?alt=media&token=9a632cda78b871b3a6eb69bddc470fef",
  //         width: 35,
  //         height: 35,
  //       });

  //       mapRef.current = marker;
  //     });

  //     setMap(newMap);
  //   });
  // }; 

   const initializeMap = () => {
    const mapProps = {
      center: [8.528818999999999, 76.94310683333333],
      traffic: true,
      zoom: 12,
      geolocation: true,
      clickableIcons: true,
    };

    mapplsClassObject.initialize(`${authToken}`, () => {
      if (mapContainerRef.current) {
        const map = mapplsClassObject.Map({
          id: "map-container",
          properties: mapProps,
        });

        if (map && typeof map.on === "function") {
          map.on("load", () => {
            setMap(map); // Save the map object to state
            setIsMapLoaded(true);
          });

           map.on("click", ({ lngLat: { lat, lng } }) => {
          if (markerRefOne.current) {
            markerRefOne.current.remove();
          }

          const newMarker = mapplsClassObject.Marker({
            map: map,
            position: { lat, lng },
            icon: "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Flocation.png?alt=media&token=a3af3a58-a2c9-4eb1-8566-b06df5f14edb",
            width: 35,
            height: 35,
          });

          markerRefOne.current = newMarker;
        });
        } else {
          console.error(
            "mapObject.on is not a function or mapObject is not defined"
          );
        }
      } else {
        console.error("Map container not found");
      }
    });
  };

  useEffect(() => {
    const getTokenAndInitMap = async () => {
      if (isOpen) {
        const token = await fetchMapplsAuthToken(navigate);
        console.log("Fetched Mappls Token:", token);
        setAuthToken(token);
        if (token) initializeMap(token);
      } else {
        cleanupMap();
      }
    };

    getTokenAndInitMap();
  }, [isOpen]);

  const handleSave = () => {
  if (markerRefOne.current) {
    const { lat, lng } = markerRefOne.current.getPosition();
    console.log("Coordinates:", lat, lng); // <-- Now it should work!
    onLocationSelect({ lat, lng });
  } else {
    console.warn("No marker selected");
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
            style={{ width: "100%", height: "500px", borderRadius: "8px" }}
          ></div>

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
    </div>
  );

};

export default MapModal;
