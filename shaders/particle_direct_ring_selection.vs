#version 140

// particle_direct_ring_selection.vs

#include "particle_common.vs"
#include "generic_include.fs"

out vec4 v_Color;
out vec2 v_TexCoord;
out float v_PixelScale;


// Señal de opciones en una fracción del diámetro. Restaurar el original antes de dibujar.
out float v_IconosRingCode;
const float IconosDiametros[50] = float[](6.00000000, 7.00000000, 8.00000000, 9.00000000, 9.50000000, 10.00000000, 11.00000000, 12.00000000, 13.00000000, 13.50000000, 14.00000000, 15.00000000, 16.00000000, 16.60000000, 17.00000000, 18.00000000, 20.00000000, 21.00000000, 21.50000000, 22.00000000, 23.00000000, 24.00000000, 25.00000000, 26.00000000, 28.00000000, 30.00000000, 31.00000000, 32.00000000, 34.00000000, 35.50000000, 36.00000000, 38.00000000, 40.00000000, 43.00000000, 44.00000000, 46.00000000, 47.50000000, 49.50000000, 50.00000000, 55.00000000, 63.00000000, 64.00000000, 69.00000000, 72.50000000, 73.00000000, 74.00000000, 75.00000000, 78.00000000, 105.00000000, 200.00000000);
vec2 iconosDecode(float raw) {
    for (int i = 0; i < 50; ++i) {
        float f = (raw - IconosDiametros[i]) * 4096.0;
        float n = floor(f + 0.5);
        if (n >= 3.0 && n <= 243.0 && mod(n, 16.0) == 3.0 && abs(f - n) < 0.12500000)
            return vec2(IconosDiametros[i], floor(n / 16.0));
    }
    return vec2(raw, 0.0);
}

void main()
{
    // To start with, sample the relevant data from the input stream. We need to know where in the buffer to read from.

    // The "stride" is 4, meaning we read 4 float-4s per particle.
    int stride = 4;
    int sampleBase = (gl_InstanceID * stride) + InstanceBufferParams.x;
    vec4 posAndScale = texelFetch(ParticleInstanceData, sampleBase);

    vec4 orientation = texelFetch(ParticleInstanceData, sampleBase + 1);
    vec4 uvOffsetAndScale = texelFetch(ParticleInstanceData, sampleBase + 2);

    v_Color = texelFetch(ParticleInstanceData, sampleBase + 3);
    vec2 packet = iconosDecode(v_Color.b);
    posAndScale.w -= v_Color.b - packet.x;
    v_Color.b = packet.x;
    v_IconosRingCode = packet.y;

    vec4 w_transform = vec4(WorldViewProjTransform[0][3], WorldViewProjTransform[1][3], WorldViewProjTransform[2][3], WorldViewProjTransform[3][3]);
    float w = dot(w_transform, vec4(posAndScale.xyz, 1.0));

    v_PixelScale = w / screenSize.z / min(screenSize.w, 1.0);

    // Get the quad corner position, rotated by the orientation quaternion.
    vec3 rotated_pos = rotate_vector_quaternion(orientation, (vec3((a_Position.xy - 0.5) * (posAndScale.w + 4.0 * v_PixelScale), uvOffsetAndScale.z)));
    vec4 worldPos = vec4(rotated_pos + posAndScale.xyz, 1.0);

    gl_Position = WorldViewProjTransform * worldPos;
    v_TexCoord = vec2(a_TexCoord.x, uvOffsetAndScale.x + uvOffsetAndScale.y * (1.0 - a_TexCoord.y));
}
