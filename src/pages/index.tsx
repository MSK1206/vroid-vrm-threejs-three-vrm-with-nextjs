import Head from 'next/head'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useEffect, useRef } from 'react'
import styles from '@/styles/Home.module.css'


export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    innerWidth = 1000
    innerHeight = 700
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })

    renderer.setPixelRatio(devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    
    const threeModel = mountRef.current
    threeModel?.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    camera.position.set(0, 1.1, 3)
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false
    controls.enableDamping = true
    controls.target.set(0, 0.85, 0)
    controls.screenSpacePanning = true
    controls.update()

    const scene = new THREE.Scene()

    const light = new THREE.DirectionalLight(0xffffff)
    light.position.set(1, 1, 1).normalize()

    const loader = new GLTFLoader()
    loader.load(
      '/testmodel.vrm',
      function (gltf) {
        scene.add(gltf.scene)
      },
      undefined,
      function (error) {
        console.error(error)
      }
    )

    const tick = () => {
      scene.add(light)
      renderer.render(scene, camera)

      requestAnimationFrame(tick)
    }

    tick()

    return () => {
      threeModel?.removeChild(renderer.domElement)
    }
    },[])
  return (
    <>
      <Head>
        <title>Vroid VRM Model Test</title>
        <meta name="description" content="Vroid VRM Model Test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.vrm} ref={mountRef} />
      </main>
    </>
  )
}
