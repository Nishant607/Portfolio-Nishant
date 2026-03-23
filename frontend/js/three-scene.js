// Three.js 3D Background System
document.addEventListener("DOMContentLoaded", () => {
    // Disable on mobile for performance based on prompt
    if (window.innerWidth < 480) {
        return;
    }

    const canvas = document.getElementById("three-canvas");
    if (!canvas || typeof THREE === "undefined") return;

    // --- SETUP SCENE ---
    const scene = new THREE.Scene();
    // No background color, it's transparent over our CSS gradients
    
    // --- CAMERA ---
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 250;

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance
    renderer.setSize(window.innerWidth, window.innerHeight);

    // --- LAYER 1: PARTICLE FIELD ---
    const particlesCount = window.innerWidth < 768 ? 800 : 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    const color1 = new THREE.Color("#7c3aed"); // Purple Main
    const color2 = new THREE.Color("#a855f7"); // Purple Bright
    const color3 = new THREE.Color("#ffffff"); // White
    
    for (let i = 0; i < particlesCount * 3; i+=3) {
        // x, y, z spread between -300 and 300
        posArray[i] = (Math.random() - 0.5) * 600;
        posArray[i+1] = (Math.random() - 0.5) * 600;
        posArray[i+2] = (Math.random() - 0.5) * 600;
        
        let randColor = Math.random();
        let mixColor;
        if (randColor < 0.6) mixColor = color1;
        else if (randColor < 0.9) mixColor = color2;
        else mixColor = color3;
        
        colorArray[i] = mixColor.r;
        colorArray[i+1] = mixColor.g;
        colorArray[i+2] = mixColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- LAYER 2: NEURAL NETWORK WEB ---
    // Creating 80 node points and a line system
    const nodesCount = 80;
    const nodesGeometry = new THREE.BufferGeometry();
    const nodesPos = new Float32Array(nodesCount * 3);
    const nodeVelocities = [];

    for (let i = 0; i < nodesCount * 3; i+=3) {
        nodesPos[i] = (Math.random() - 0.5) * 400;
        nodesPos[i+1] = (Math.random() - 0.5) * 400;
        nodesPos[i+2] = (Math.random() - 0.5) * 200;
        
        nodeVelocities.push({
            x: (Math.random() - 0.5) * 0.2,
            y: (Math.random() - 0.5) * 0.2,
            z: (Math.random() - 0.5) * 0.2
        });
    }

    nodesGeometry.setAttribute('position', new THREE.BufferAttribute(nodesPos, 3));

    // Material for the lines connecting nodes
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.15
    });

    let linesMesh; // We will generate this in the animation loop

    // --- LAYER 3: FLOATING GEOMETRY ---
    // Icosahedron on the right side
    const icosaGeometry = new THREE.IcosahedronGeometry(45, 1);
    const icosaMaterial = new THREE.MeshPhongMaterial({
        color: 0xa855f7,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const icosahedron = new THREE.Mesh(icosaGeometry, icosaMaterial);
    
    // Position it to the right
    icosahedron.position.x = window.innerWidth > 1024 ? 100 : 0;
    icosahedron.position.y = 10;
    scene.add(icosahedron);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0x3b0764, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xc084fc, 2, 300);
    // Position near the icosahedron
    pointLight.position.set(120, 30, 50);
    scene.add(pointLight);

    // --- MOUSE PARALLAX ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // --- ANIMATION CONTROLLER ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Target for camera parallax
        targetX = mouseX * 0.05;
        targetY = mouseY * 0.05;

        // Smooth camera movement
        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (-targetY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        // Particle field wave motion
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.position.y = Math.sin(elapsedTime * 0.2) * 5;

        // Icosahedron rotation and float
        icosahedron.rotation.x += 0.003;
        icosahedron.rotation.y += 0.005;
        icosahedron.position.y = Math.sin(elapsedTime * 0.5) * 10;

        // Neural Network logic (Update node positions and lines)
        updateNeuralNetwork(elapsedTime);

        renderer.render(scene, camera);
    }

    function updateNeuralNetwork(elapsedTime) {
        const positions = nodesGeometry.attributes.position.array;
        
        // Update positions based on velocities
        for(let i=0; i<nodesCount; i++) {
            positions[i*3] += nodeVelocities[i].x;
            positions[i*3+1] += nodeVelocities[i].y;
            positions[i*3+2] += nodeVelocities[i].z;
            
            // Bounds check to bounce them back
            if(positions[i*3] > 200 || positions[i*3] < -200) nodeVelocities[i].x *= -1;
            if(positions[i*3+1] > 200 || positions[i*3+1] < -200) nodeVelocities[i].y *= -1;
            if(positions[i*3+2] > 100 || positions[i*3+2] < -100) nodeVelocities[i].z *= -1;
        }
        nodesGeometry.attributes.position.needsUpdate = true;

        // Draw connections if close enough
        const linePositions = [];
        const distanceThreshold = 60;

        for(let i=0; i<nodesCount; i++) {
            for(let j=i+1; j<nodesCount; j++) {
                const dx = positions[i*3] - positions[j*3];
                const dy = positions[i*3+1] - positions[j*3+1];
                const dz = positions[i*3+2] - positions[j*3+2];
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

                if (dist < distanceThreshold) {
                    linePositions.push(
                        positions[i*3], positions[i*3+1], positions[i*3+2],
                        positions[j*3], positions[j*3+1], positions[j*3+2]
                    );
                }
            }
        }

        if(linesMesh) {
            scene.remove(linesMesh);
            linesMesh.geometry.dispose();
        }

        if(linePositions.length > 0) {
            const lineGeometry = new THREE.BufferGeometry();
            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            linesMesh = new THREE.LineSegments(lineGeometry, linesMaterial);
            
            // Apply mouse parallax rotation to lines as well
            linesMesh.rotation.y = elapsedTime * 0.02; // use clock properly by shifting logic
            
            scene.add(linesMesh);
        }
    }

    animate();

    // --- RESIZE EVENT ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Reposition icosahedron
        icosahedron.position.x = window.innerWidth > 1024 ? 100 : 0;
    });
});
