import React from  'react'
import {MapContainer, LayersControl,LayerGroup, Circle, Rectangle,FeatureGroup, TileLayer, Marker, Popup} from  'react-leaflet'
//Don't forget to import the css
import  'leaflet/dist/leaflet.css'

  
function MyMap() {
    //Some random co-ordinate
	const position = [51.505, -0.09]
  const center = [51.505, -0.09]
  const rectangle = [
    [51.49, -0.08],
    [51.5, -0.06],
  ]
    //Do not forget to set a width and height style to your map. Else it won't show up
	return (
    <div>
      <MapContainer  
        style={{width: '800px', height: '500px'}} 
        center={position}  zoom={13}  
        scrollWheelZoom={false}>
       <LayersControl position="topright">
      <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="OpenStreetMap.BlackAndWhite">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.Overlay name="Marker with popup">
        <Marker position={center}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </LayersControl.Overlay>
      <LayersControl.Overlay checked name="Layer group with circles">
        <LayerGroup>
          <Circle
            center={center}
            pathOptions={{ fillColor: 'blue' }}
            radius={200}
          />
          <Circle
            center={center}
            pathOptions={{ fillColor: 'red' }}
            radius={100}
            stroke={false}
          />
          <LayerGroup>
            <Circle
              center={[51.51, -0.08]}
              pathOptions={{ color: 'green', fillColor: 'green' }}
              radius={100}
            />
          </LayerGroup>
        </LayerGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Feature group">
        <FeatureGroup pathOptions={{ color: 'purple' }}>
          <Popup>Popup in FeatureGroup</Popup>
          <Circle center={[51.51, -0.06]} radius={200} />
          <Rectangle bounds={rectangle} />
        </FeatureGroup>
      </LayersControl.Overlay>
    </LayersControl>
      </MapContainer>
    </div>
	)
}

export  default MyMap