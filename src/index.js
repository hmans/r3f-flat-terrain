import { Box } from "@react-three/drei"
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing"
import React, { useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import { Canvas, useFrame } from "react-three-fiber"
import "./styles.css"

const Terrain = ({ width = 32, height = 32 }) => {
	const geoRef = useRef()

	useEffect(() => {
		const geometry = geoRef.current

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				const vertex = geometry.vertices[y * width + x]
				vertex.z = Math.pow(Math.random(), 3) * 2
			}
		}

		geometry.computeVertexNormals()
		geometry.computeFaceNormals()
	}, [height, width])

	return (
		<mesh receiveShadow castShadow>
			<planeGeometry args={[width, height, width, height]} ref={geoRef} />
			<meshStandardMaterial color="#ccc" flatShading />
		</mesh>
	)
}

const RotatingScene = ({ children }) => {
	const ref = useRef()

	useFrame((_, dt) => {
		ref.current.rotation.z += 0.08 * dt
	})

	return <group ref={ref}>{children}</group>
}

ReactDOM.render(
	<Canvas camera={{ up: [0, 0, 1], position: [0, -8, 6] }} shadowMap>
		<color args="#222" attach="background" />

		<ambientLight intensity={0.3} />
		<directionalLight
			position={[10, -4, 10]}
			intensity={0.7}
			castShadow
			shadow-bias={-0.00001}
			shadow-mapSize-height={2048}
			shadow-mapSize-width={2048}
		/>

		<RotatingScene>
			<Terrain />
			<Box args={[7, 7, 7]} castShadow>
				<meshStandardMaterial color="#833" flatShading />
			</Box>
		</RotatingScene>

		<EffectComposer>
			<DepthOfField focusDistance={0.01} focalLength={0.02} bokehScale={4} height={480} />
			<Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
			<Noise opacity={0.02} />
			<Vignette offset={0.1} darkness={1} />
		</EffectComposer>
	</Canvas>,
	document.getElementById("root")
)
