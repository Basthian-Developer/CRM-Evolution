import { useEffect, useState } from 'react'
import heroImg from '@assets/hero.png'
import reactLogo from '@assets/react.svg'
import viteLogo from '@assets/vite.svg'

import useClientes from '@hooks/useClientes'
import useInteracciones from '@hooks/useInteracciones'
import useTareas from '@hooks/useTareas'

import '@pages/home/Home.css'

function Home() {
  const [count, setCount] = useState(0)

  const { data: dataClientes, isLoading: loadingClientes, error: errorClientes } = useClientes();
  const clientes = dataClientes ?? [];

  const {data: dataInteracciones, isLoading: loadingInteracciones, error: errorInteracciones} = useInteracciones();
  const interacciones = dataInteracciones ?? [];

  const { data: dataTareas, isLoading: loadingTareas, error: errorTareas } = useTareas();

  useEffect(() => {
    if (loadingClientes) {
      return;
    }
    if (errorClientes) {
      console.error(errorClientes);
      return;
    }

    if (clientes.length === 0) {
      console.log("No hay datos");
      return;
    }

    console.log("Clientes", clientes);
  }, [clientes, loadingClientes, errorClientes]);

  useEffect(() => {
    if (loadingInteracciones) {
      return;
    }
    if (errorInteracciones) {
      console.error(errorInteracciones);
      return;
    }

    if (interacciones.length === 0) {
      console.log("No hay datos");
      return;
    }

    console.log("Interacciones",interacciones);
  }, [interacciones, loadingInteracciones, errorInteracciones]);

  useEffect(() => {
    if (loadingTareas) {
      return;
    }
    if (errorTareas) {
      console.error(errorTareas);
      return;
    }

    const tareas = dataTareas ?? [];
    if (tareas.length === 0) {
      console.log("No hay datos");
      return;
    }

    console.log("Tareas", tareas);
  }, [dataTareas, loadingTareas, errorTareas]);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href={`${import.meta.env.BASE_URL}icons.svg#documentation-icon`}></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href={`${import.meta.env.BASE_URL}icons.svg#social-icon`}></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href={`${import.meta.env.BASE_URL}icons.svg#github-icon`}></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href={`${import.meta.env.BASE_URL}icons.svg#discord-icon`}></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href={`${import.meta.env.BASE_URL}icons.svg#x-icon`}></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href={`${import.meta.env.BASE_URL}icons.svg#bluesky-icon`}></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default Home
