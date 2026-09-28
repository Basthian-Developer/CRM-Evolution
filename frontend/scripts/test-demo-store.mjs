import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

// Ejecuta el almacén aislado con los JSON reales y fetch de solo lectura simulado.
const source = await readFile(
  new URL('../src/repositories/json/demoStore.ts', import.meta.url),
  'utf8',
);
const compiled = ts
  .transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  })
  .outputText.replaceAll('import.meta.env.BASE_URL', "'/'");

test('Operaciones de demo sin alterar los archivos originales', async () => {
  const archivos = ['clientes', 'interacciones', 'tareas'];
  const originales = Object.fromEntries(
    await Promise.all(
      archivos.map(async (nombre) => [
        nombre,
        await readFile(
          new URL(`../public/data/${nombre}.json`, import.meta.url),
          'utf8',
        ),
      ]),
    ),
  );
  const fetchOriginal = globalThis.fetch;
  const consultas = [];
  globalThis.fetch = async (url, opciones) => {
    assert.equal(opciones?.method ?? 'GET', 'GET');
    consultas.push(url);
    const nombre = url.split('/').pop().replace('.json', '');
    return new Response(originales[nombre], { status: 200 });
  };
  try {
    const { demoStore } = await import(
      `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
    );
    const iniciales = await demoStore.clientes();
    const notas = await demoStore.interacciones();
    await demoStore.crearCliente({
      nombre: ' Demo ',
      apellido: 'Prueba',
      email: 'DEMO-TEST@example.com',
      telefono: '123456',
      estado: 'prospecto',
    });
    const cliente = (await demoStore.clientes())[0];
    assert.equal(cliente.nombre, 'Demo');
    assert.equal(cliente.email, 'demo-test@example.com');
    assert.equal((await demoStore.clientes()).length, iniciales.length + 1);
    await assert.rejects(demoStore.crearCliente({ ...cliente }), /Ya existe/);
    await assert.rejects(
      demoStore.crearCliente({
        ...cliente,
        email: 'otro@example.com',
        nombre: '  ',
      }),
      /nombre/,
    );

    await demoStore.cambiarEstado(cliente.id, 'cliente');
    const actualizado = (await demoStore.clientes()).find(
      (item) => item.id === cliente.id,
    );
    assert.equal(actualizado.estado, 'cliente');
    assert.equal(cliente.estado, 'prospecto', 'Las copias previas no se mutan');
    const historial = await demoStore.interacciones();
    assert.equal(historial.length, notas.length + 1);
    assert.equal(historial[0].clienteId, cliente.id);
    assert.match(historial[0].descripcion, /Prospecto → Cliente/);
    await demoStore.cambiarEstado(cliente.id, 'cliente');
    assert.equal((await demoStore.interacciones()).length, historial.length);
    await demoStore.cambiarEstado(cliente.id, 'inactivo');
    assert.match(
      (await demoStore.interacciones())[0].descripcion,
      /Cliente → Inactivo/,
    );
    await assert.rejects(demoStore.cambiarEstado('inexistente', 'cliente'));
    await assert.rejects(demoStore.cambiarEstado(cliente.id, 'incorrecto'));

    const entrada = {
      clienteId: cliente.id,
      titulo: 'Seguimiento',
      prioridad: 'alta',
    };
    await demoStore.crearTarea(entrada);
    const tarea = (await demoStore.tareas())[0];
    assert.equal(tarea.clienteId, cliente.id);
    assert.equal(tarea.estado, 'pendiente');
    assert.equal(tarea.fechaCompleted, '');
    await assert.rejects(
      demoStore.crearTarea({ ...entrada, clienteId: 'inexistente' }),
    );
    await assert.rejects(
      demoStore.crearTarea({ ...entrada, fechaLimited: '2026-02-30' }),
    );
    await assert.rejects(
      demoStore.crearTarea({ ...entrada, prioridad: 'incorrecta' }),
    );
    const cantidad = (await demoStore.tareas()).length;
    await Promise.all([
      demoStore.crearTarea(entrada),
      demoStore.crearTarea(entrada),
    ]);
    assert.equal((await demoStore.tareas()).length, cantidad + 2);
    assert.equal(
      consultas.length,
      3,
      'Recargar consultas conserva los cambios en memoria',
    );
    for (const nombre of archivos)
      assert.equal(
        await readFile(
          new URL(`../public/data/${nombre}.json`, import.meta.url),
          'utf8',
        ),
        originales[nombre],
      );
  } finally {
    globalThis.fetch = fetchOriginal;
  }
});
