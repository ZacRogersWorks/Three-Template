import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lilGui from 'lil-gui'
import { Camera, WebGLBufferRenderer } from 'three'

export default function three() {

    // Debug panel
    const gui = new lilGui.GUI()

    //Canvas
    const canvas = document.querySelector('#webgl')

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('black')

    // Textures
    const textureLoader = new THREE.TextureLoader()

    const sphereColor = textureLoader.load('src/images/textures/rock/Rock037_1K_Color.jpg')
    const sphereAmbOcc = textureLoader.load('src/images/textures/rock/Rock037_1K_AmbientOcclusion.jpg')
    const sphereDisplace = textureLoader.load('src/images/textures/rock/Rock037_1K_Displacement.jpg')
    const sphereNormal = textureLoader.load('src/images/textures/rock/Rock037_1K_NormalGL.jpg')
    const sphereRoughness = textureLoader.load('src/images/textures/rock/Rock037_1K_Roughness.jpg')

    // Materials
    const sphereMaterial = new THREE.MeshStandardMaterial({
        map: sphereColor,
        displacementMap: sphereDisplace,
        displacementScale: .02,
        aoMap: sphereAmbOcc,
        normalMap: sphereNormal,
        roughnessMap: sphereRoughness
    })

    // Objects
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 128, 128),
        sphereMaterial
    )
    scene.add(sphere)

    // Lights
    const pointLight = new THREE.PointLight(0xffffff, 2)
    pointLight.position.y = 1
    pointLight.position.z = 4
    scene.add(pointLight)

    const pointLightHelper = new THREE.PointLightHelper(pointLight, .1)
    scene.add(pointLightHelper)

    // Screen resize
    const screenSize = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () => {
        screenSize.width = window.innerWidth
        screenSize.height = window.innerHeight

        // Update camera view
        camera.aspect = screenSize.width / screenSize.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(screenSize.width, screenSize.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    // Camera
    const camera = new THREE.PerspectiveCamera(75, screenSize.width / screenSize.height, .1, 1000)
    camera.position.set(0, 0, 4)
    scene.add(camera)

    // GUI elements

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setSize(screenSize.width, screenSize.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Animation
    const clock = new THREE.Clock()

    const frame = () => {
        const elapsedTime = clock.getElapsedTime()

        // Update objects
        // sphere.rotation.x = elapsedTime * .5
        sphere.rotation.y = elapsedTime * .5
        // sphere.rotation.z = elapsedTime * .5

        pointLight.position.x = Math.cos(elapsedTime / 2) * 3
        pointLight.position.z = Math.sin(elapsedTime / 2) * 3

        // Update controls
        controls.update()

        // Update renderer
        renderer.render(scene, camera)

        // Call next frame
        window.requestAnimationFrame(frame)
    }
    frame()
}