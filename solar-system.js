// Import Three.js library
import * as THREE from "three"

// Solar System 3D Simulation with Three.js
class SolarSystem {
  constructor() {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.controls = null
    this.clock = new THREE.Clock()
    this.isPaused = false
    this.isLightTheme = false

    // Planet data with realistic relative sizes and distances
    this.planetData = [
      { name: "Mercury", color: 0x8c7853, size: 0.4, distance: 8, speed: 4.15, info: "Closest planet to the Sun" },
      {
        name: "Venus",
        color: 0xffc649,
        size: 0.9,
        distance: 12,
        speed: 1.62,
        info: "Hottest planet in our solar system",
      },
      {
        name: "Earth",
        color: 0x6b93d6,
        size: 1,
        distance: 16,
        speed: 1.0,
        info: "Our home planet with water and life",
      },
      {
        name: "Mars",
        color: 0xc1440e,
        size: 0.5,
        distance: 20,
        speed: 0.53,
        info: "The Red Planet with polar ice caps",
      },
      {
        name: "Jupiter",
        color: 0xd8ca9d,
        size: 3,
        distance: 28,
        speed: 0.08,
        info: "Largest planet with Great Red Spot",
      },
      {
        name: "Saturn",
        color: 0xfad5a5,
        size: 2.5,
        distance: 36,
        speed: 0.03,
        info: "Beautiful planet with prominent rings",
      },
      { name: "Uranus", color: 0x4fd0e7, size: 1.8, distance: 44, speed: 0.01, info: "Ice giant tilted on its side" },
      {
        name: "Neptune",
        color: 0x4b70dd,
        size: 1.7,
        distance: 52,
        speed: 0.006,
        info: "Windiest planet in the solar system",
      },
    ]

    this.planets = []
    this.planetMeshes = []
    this.orbitLines = []
    this.stars = null
    this.sun = null
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.tooltip = null

    this.init()
    this.createControls()
    this.setupEventListeners()
    this.animate()
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene()

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.set(0, 30, 60)

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.getElementById("canvas-container").appendChild(this.renderer.domElement)

    // Create orbit controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.minDistance = 10
    this.controls.maxDistance = 200

    // Create lighting
    this.createLighting()

    // Create background stars
    this.createStars()

    // Create sun
    this.createSun()

    // Create planets
    this.createPlanets()

    // Create orbit lines
    this.createOrbitLines()
  }

  createLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2)
    this.scene.add(ambientLight)

    // Sun light (point light)
    const sunLight = new THREE.PointLight(0xffffff, 2, 300)
    sunLight.position.set(0, 0, 0)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 2048
    sunLight.shadow.mapSize.height = 2048
    this.scene.add(sunLight)
  }

  createStars() {
    const starsGeometry = new THREE.BufferGeometry()
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })

    const starsVertices = []
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000
      const y = (Math.random() - 0.5) * 2000
      const z = (Math.random() - 0.5) * 2000
      starsVertices.push(x, y, z)
    }

    starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starsVertices, 3))
    this.stars = new THREE.Points(starsGeometry, starsMaterial)
    this.scene.add(this.stars)
  }

  createSun() {
    const sunGeometry = new THREE.SphereGeometry(3, 32, 32)
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffaa00,
      emissiveIntensity: 0.3,
    })
    this.sun = new THREE.Mesh(sunGeometry, sunMaterial)
    this.scene.add(this.sun)
  }

  createPlanets() {
    this.planetData.forEach((planetInfo, index) => {
      // Create planet geometry and material
      const geometry = new THREE.SphereGeometry(planetInfo.size, 32, 32)
      const material = new THREE.MeshLambertMaterial({ color: planetInfo.color })
      const planet = new THREE.Mesh(geometry, material)

      // Enable shadows
      planet.castShadow = true
      planet.receiveShadow = true

      // Set initial position
      planet.position.x = planetInfo.distance
      planet.userData = { ...planetInfo, index, currentSpeed: planetInfo.speed }

      // Create planet group for orbit animation
      const planetGroup = new THREE.Group()
      planetGroup.add(planet)
      this.scene.add(planetGroup)

      this.planets.push(planetGroup)
      this.planetMeshes.push(planet)

      // Special case for Saturn - add rings
      if (planetInfo.name === "Saturn") {
        this.createSaturnRings(planet)
      }
    })
  }

  createSaturnRings(saturn) {
    const ringGeometry = new THREE.RingGeometry(3, 5, 32)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    })
    const rings = new THREE.Mesh(ringGeometry, ringMaterial)
    rings.rotation.x = Math.PI / 2
    saturn.add(rings)
  }

  createOrbitLines() {
    this.planetData.forEach((planetInfo) => {
      const points = []
      const segments = 64

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(angle) * planetInfo.distance, 0, Math.sin(angle) * planetInfo.distance))
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.3,
      })
      const orbitLine = new THREE.Line(geometry, material)
      this.scene.add(orbitLine)
      this.orbitLines.push(orbitLine)
    })
  }

  createControls() {
    const controlsContainer = document.getElementById("planet-controls")

    this.planetData.forEach((planetInfo, index) => {
      const controlDiv = document.createElement("div")
      controlDiv.className = "planet-control"

      controlDiv.innerHTML = `
                <label>${planetInfo.name}</label>
                <input type="range" 
                       id="speed-${index}" 
                       min="0" 
                       max="10" 
                       step="0.1" 
                       value="${planetInfo.speed}">
                <div class="speed-value">Speed: <span id="value-${index}">${planetInfo.speed.toFixed(1)}</span>x</div>
            `

      controlsContainer.appendChild(controlDiv)

      // Add event listener for speed control
      const slider = document.getElementById(`speed-${index}`)
      const valueDisplay = document.getElementById(`value-${index}`)

      slider.addEventListener("input", (e) => {
        const newSpeed = Number.parseFloat(e.target.value)
        this.planetMeshes[index].userData.currentSpeed = newSpeed
        valueDisplay.textContent = newSpeed.toFixed(1)
      })
    })
  }

  setupEventListeners() {
    // Window resize
    window.addEventListener("resize", () => this.onWindowResize())

    // Mouse events for planet interaction
    this.renderer.domElement.addEventListener("mousemove", (e) => this.onMouseMove(e))
    this.renderer.domElement.addEventListener("click", (e) => this.onMouseClick(e))

    // Pause/Resume button
    document.getElementById("pause-btn").addEventListener("click", () => this.togglePause())

    // Theme toggle button
    document.getElementById("theme-toggle").addEventListener("click", () => this.toggleTheme())

    // Create tooltip element
    this.tooltip = document.createElement("div")
    this.tooltip.className = "tooltip"
    this.tooltip.style.display = "none"
    document.body.appendChild(this.tooltip)
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera)

    // Check for intersections with planets
    const intersects = this.raycaster.intersectObjects(this.planetMeshes)

    if (intersects.length > 0) {
      const planet = intersects[0].object
      this.tooltip.style.display = "block"
      this.tooltip.style.left = event.clientX + 10 + "px"
      this.tooltip.style.top = event.clientY - 30 + "px"
      this.tooltip.innerHTML = `<strong>${planet.userData.name}</strong><br>${planet.userData.info}`
      document.body.style.cursor = "pointer"
    } else {
      this.tooltip.style.display = "none"
      document.body.style.cursor = "default"
    }
  }

  onMouseClick(event) {
    // Update mouse position
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera)

    // Check for intersections with planets
    const intersects = this.raycaster.intersectObjects(this.planetMeshes)

    if (intersects.length > 0) {
      const planet = intersects[0].object
      this.showPlanetInfo(planet.userData)

      // Smooth camera movement to planet
      const planetPosition = planet.getWorldPosition(new THREE.Vector3())
      const distance = 15
      const targetPosition = new THREE.Vector3(
        planetPosition.x + distance,
        planetPosition.y + distance,
        planetPosition.z + distance,
      )

      this.animateCameraTo(targetPosition, planetPosition)
    }
  }

  showPlanetInfo(planetData) {
    const planetInfo = document.getElementById("planet-info")
    const planetName = document.getElementById("planet-name")
    const planetDetails = document.getElementById("planet-details")
    const instructions = document.getElementById("instructions")

    planetName.textContent = planetData.name
    planetDetails.innerHTML = `
            ${planetData.info}<br>
            <small>Distance from Sun: ${planetData.distance} AU<br>
            Current Speed: ${planetData.currentSpeed.toFixed(1)}x</small>
        `

    planetInfo.style.display = "block"
    instructions.style.display = "none"

    // Hide after 5 seconds
    setTimeout(() => {
      planetInfo.style.display = "none"
      instructions.style.display = "block"
    }, 5000)
  }

  animateCameraTo(targetPosition, lookAtPosition) {
    const startPosition = this.camera.position.clone()
    const startTime = Date.now()
    const duration = 2000 // 2 seconds

    const animateCamera = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Smooth easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      this.camera.position.lerpVectors(startPosition, targetPosition, easeProgress)
      this.camera.lookAt(lookAtPosition)

      if (progress < 1) {
        requestAnimationFrame(animateCamera)
      }
    }

    animateCamera()
  }

  togglePause() {
    this.isPaused = !this.isPaused
    const pauseBtn = document.getElementById("pause-btn")
    pauseBtn.textContent = this.isPaused ? "▶️ Resume" : "⏸️ Pause"
    pauseBtn.classList.toggle("paused", this.isPaused)
  }

  toggleTheme() {
    this.isLightTheme = !this.isLightTheme
    document.body.classList.toggle("light-theme", this.isLightTheme)

    if (this.isLightTheme) {
      this.scene.background = new THREE.Color(0x87ceeb)
      this.stars.material.color.setHex(0x000080)
    } else {
      this.scene.background = null
      this.stars.material.color.setHex(0xffffff)
    }

    const themeBtn = document.getElementById("theme-toggle")
    themeBtn.textContent = this.isLightTheme ? "☀️ Light" : "🌙 Dark"
  }

  animate() {
    requestAnimationFrame(() => this.animate())

    if (!this.isPaused) {
      const elapsedTime = this.clock.getElapsedTime()

      // Rotate sun
      if (this.sun) {
        this.sun.rotation.y += 0.01
      }

      // Animate planets
      this.planets.forEach((planetGroup, index) => {
        const planet = this.planetMeshes[index]
        const speed = planet.userData.currentSpeed

        // Orbit animation
        planetGroup.rotation.y = elapsedTime * speed * 0.1

        // Planet rotation
        planet.rotation.y += 0.02
      })

      // Animate stars
      if (this.stars) {
        this.stars.rotation.y += 0.0002
      }
    }

    // Update controls
    this.controls.update()

    // Render scene
    this.renderer.render(this.scene, this.camera)
  }
}

// Initialize the solar system when the page loads
window.addEventListener("load", () => {
  new SolarSystem()
})
