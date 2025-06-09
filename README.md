# 3DSolarSystem
🌌 3D Solar System Simulation | Three.js  
# 🚀 Advanced 3D Solar System Orbit Simulation

Welcome to the Advanced 3D Solar System Orbit Simulation! This interactive web application provides a stunning visualization of our solar system, allowing users to explore planets, comets, asteroids, and space stations in a dynamic 3D environment. You can control various aspects of the simulation, including planet speeds, zoom levels, and visibility of different celestial objects.

## ✨ Features

*   **Interactive 3D Simulation**: Explore a realistic representation of the solar system with orbiting planets, a sun, and dynamically generated stars.
*   **Planet Controls**: Adjust the orbital speed of individual planets.
*   **Object Information**: Click on planets, comets, asteroids, and space stations to view detailed information.
*   **Toggle Visibility**: Show/hide comets, asteroids, and space stations.
*   **Theme Switch**: Seamlessly toggle between a dark (space) and light (day) theme.
*   **Zoom Functionality**: Zoom in and out of the solar system for closer inspection or a wider view.
*   **Responsive Design**: Enjoy the simulation on various screen sizes.
*   **About Creator Modal**: Learn more about the creator of this application.

## 🛠️ Technologies Used

This project is built with modern web technologies to deliver a rich and interactive experience:

*   **Next.js**: A React framework for building fast and scalable web applications, providing server-side rendering (SSR) and static site generation (SSG) capabilities.
*   **React**: A JavaScript library for building user interfaces.
*   **Three.js**: A powerful 3D JavaScript library used for rendering and animating the 3D celestial objects.
*   **@react-three/fiber**: A React renderer for Three.js, making it easier to integrate 3D scenes into React components.
*   **@react-three/drei**: A collection of useful helpers and abstractions for `@react-three/fiber`.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly styling the application with minimal custom CSS.
*   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.

## ⚙️ Setup and Installation

Follow these steps to set up the project locally on your machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (Node Package Manager) or yarn

### Installation Steps

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Himanshu-Bali/advanced-3d-orbit.git
    cd advanced-3d-orbit
    ```

2.  **Install dependencies**:
    ```bash
    npm install --legacy-peer-deps
    # or if you use yarn
    # yarn install --legacy-peer-deps
    ```

3.  **Set up TypeScript configuration**:
    Ensure `tsconfig.json` and `next-env.d.ts` are correctly configured. These files should have been created or updated automatically if you followed the previous steps in the chat. If not, please refer to the project's `tsconfig.json` and `next-env.d.ts` for the correct configurations.

## 🚀 How to Run the Application

After installing the dependencies, you can run the development server:

```bash
npm run dev
# or if you use yarn
# yarn dev
```

The application will typically be accessible at `http://localhost:3000`.

## 🎮 Usage

*   **Controls Panel**: Located at the top-left, this panel allows you to pause/resume the simulation, toggle theme, show/hide comets, asteroids, and space stations, and adjust zoom levels.
*   **Planet Speed Sliders**: Found within the Controls Panel, these sliders allow you to individually control the orbital speed of each planet.
*   **Object Information Panel**: Located at the bottom-right, this panel displays details about selected celestial objects. Click on any planet, comet, asteroid, or space station to view its information.
*   **About Creator Button**: Click this button (at the top-center) to open a modal with information about the creator.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please feel free to open an issue or submit a pull request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 About the Creator

This project was created by Himanshu Bali, an aspiring Computer Science Engineer passionate about technology and innovation. You can learn more about the creator through the "About Creator" modal within the application. 
