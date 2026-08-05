/**
 * Pie de origen — exigido por la licencia BO-AT 1.0 (ver LICENCIA.md y ORIGEN.md).
 *
 * Puedes cambiar los estilos, moverlo de sitio o integrarlo en tu propio pie de
 * página. Lo que la licencia no permite es eliminar la mención: es la única
 * condición a cambio de poder usar, modificar, renombrar y vender este sistema.
 *
 * La fórmula es aditiva — puedes anteponer tu marca:
 *   «Mi Producto, de Mi Empresa — basado en el Business OS de Makeflowia Lab.»
 */
export function OrigenBusinessOS() {
  return (
    <div
      data-bo-origen="1"
      style={{
        padding: '10px 16px',
        textAlign: 'center',
        fontSize: '11px',
        lineHeight: 1.5,
        opacity: 0.6,
      }}
    >
      Basado en el Business OS, creado por Makeflowia Lab.
    </div>
  );
}
