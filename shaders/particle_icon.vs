#version 140

// particle_icon.vs

#include "particle_common.vs"

// ICONOS-MOD: tamano variable del icono. El motor dibuja cada icono como un quad de la celda completa (52 px) con escala propia.
// El mod pinta en el pixel superior izquierdo de cada celda un marcador (R = factor%/5, G/B fijos); si se detecta, se amplia el quad
// y se excluye el borde (marcador incluido) del muestreo. Sin marcador (o si no se puede leer) el comportamiento es el del original.
uniform sampler2D Texture;
const float ICONOS_CELDA = 52.0;
const float ICONOS_B = 0.9804;                     // B esperado en el marcador (250/255)
// G del marcador = 5 * calidad (5, 10 o 20): la celda del atlas mide 52 * calidad px y el motor dibuja el quad a ese tamano; el factor se divide por la calidad.

out vec4 v_ColorPrimary;
out vec4 v_ColorSecondary;
out vec2 v_TexCoord;
out float v_SelectedState;

void main()
{
    // To start with, sample the relevant data from the input stream. We need to know where in the buffer to read from.

    // The "stride" is 4, meaning we read 4 float-4s per particle.
    int stride = 4;
    int sampleBase = (gl_InstanceID * stride) + InstanceBufferParams.x;
    vec4 posAndScale = texelFetch(ParticleInstanceData, sampleBase);

     if (isIconOccluded(posAndScale.xyz))
     {
         gl_Position = vec4(0, 0, -1.0, 1.0);
         return;
     }

    vec4 vUVAndExtra = texelFetch(ParticleInstanceData, sampleBase + 1);

    v_ColorPrimary = texelFetch(ParticleInstanceData, sampleBase + 2);
    v_ColorSecondary = texelFetch(ParticleInstanceData, sampleBase + 3);

    // Get the world position...
    vec4 worldPos = WorldViewProjTransform * vec4(posAndScale.xyz, 1.0);

    // divide by w to covert to normalized clip space
    worldPos /= worldPos.w;

    // multiply by half the screen res to get pixel offsets...
    vec2 halfScreenSize = screenSize.xy * 0.5;
    worldPos.xy = halfScreenSize + worldPos.xy * halfScreenSize;

    // ICONOS-MOD: leer el marcador de factor (texel centro del pixel 0,0 de la celda; .bgra como en el .fs)
    float iconosFactor = 1.0;
    {
        vec4 mk = textureLod(Texture, vUVAndExtra.xy + atlas_dims.xy * (0.5 / ICONOS_CELDA), 0.0).bgra;
        float calidad = floor(mk.g * 255.0 / 5.0 + 0.5);
        if (mk.a > 0.98 && (calidad == 1.0 || calidad == 2.0 || calidad == 4.0) && abs(mk.g * 255.0 - 5.0 * calidad) < 3.0 && abs(mk.b - ICONOS_B) < 0.012)
            iconosFactor = clamp(mk.r * 255.0 * 5.0 / 100.0 / calidad, 0.2, 3.5) * ((ICONOS_CELDA - 3.0) / ICONOS_CELDA);
    }

    // offset by vert position and scale
    float scale = posAndScale.w * iconosFactor;
    vec2 quadpos = a_Position.xy - 0.5;
    vec2 offset = quadpos * scale;
    worldPos.xy += offset;

    // Clamp to exact pixel offset.
    worldPos.xy = floor(worldPos.xy);

    // Put back into normalized clip space.
    worldPos.xy /= halfScreenSize;
    worldPos.xy -= 1.0;

    v_SelectedState = vUVAndExtra.z;

    // We're already in normalized clip space, so w is just 1.0.
    gl_Position = vec4(worldPos.x, worldPos.y, worldPos.z, 1.0);

    v_TexCoord = calculateAtlasUV(vUVAndExtra.xy);
    // ICONOS-MOD: con marcador, muestrear solo el interior (1,5 px de margen: sin mezcla bilineal con el marcador)
    if (iconosFactor != 1.0)
    {
        vec2 ab = vec2(a_TexCoord.x, 1.0f - a_TexCoord.y);
        v_TexCoord = vUVAndExtra.xy + atlas_dims.xy * ((1.5 + ab * (ICONOS_CELDA - 3.0)) / ICONOS_CELDA);
    }
}
