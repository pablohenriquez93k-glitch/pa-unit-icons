#version 140

// particle_icon.fs

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D Texture;

in vec2 v_TexCoord;
in vec4 v_ColorPrimary;
in vec4 v_ColorSecondary;
in float v_SelectedState;

out vec4 out_FragColor;

void main()
{
    vec4 texel = texture(Texture, v_TexCoord).bgra; // webkit texture is bgra
    if (v_ColorPrimary.w == 0.0)
        out_FragColor = texel;
    else
    {
        // ICONOS-MOD: webkit entrega rgb premultiplicado por alpha; se des-premultiplica antes del hack para que bajar la
        // opacidad (atlas) no apague r/g. Con alpha=1 es identico al original.
        float a0 = texel.a;
        texel.rgb /= max(a0, 0.0001);
        // horrible, horrible hack to work aground webkit png handling
        texel.rgb = clamp((texel.rgb - 0.27) / 0.7, 0.0, 1.0);

        vec3 mixColor = v_SelectedState > 0.0 ? vec3(1.0, 1.0, 1.0) : vec3(0.0, 0.0, 0.0);
        // ICONOS-MOD: ratio sin dividir por alpha (ya des-premultiplicado) y color re-premultiplicado por a0 (mantiene la ley alpha^2 del original).
        vec3 color = a0 * texel.r * mix(mixColor, v_ColorPrimary.rgb, pow(texel.g, 1.0 / 2.2));

        // ICONOS-MOD: color fijo de blips. El mod marca el relleno del blip con B = 34 + 14*k (k = 0..6, valores que ningun icono usa);
        // si el pixel es relleno (R,G altos) y B cae en un codigo, se usa el color k en vez del color de equipo.
        float kc = (texel.b * 255.0 - 34.0) / 14.0;
        float kr = floor(kc + 0.5);
        if (texel.r > 0.9 && texel.g > 0.9 && kr >= 0.0 && kr <= 6.0 && abs(kc - kr) < 0.4)
        {
            vec3 fijo = vec3(1.0, 1.0, 1.0);
            if (kr < 0.5) fijo = vec3(1.0, 0.2, 0.2);
            else if (kr < 1.5) fijo = vec3(1.0, 0.9, 0.15);
            else if (kr < 2.5) fijo = vec3(0.25, 0.95, 0.25);
            else if (kr < 3.5) fijo = vec3(0.15, 0.9, 1.0);
            else if (kr < 4.5) fijo = vec3(0.3, 0.4, 1.0);
            else if (kr < 5.5) fijo = vec3(1.0, 0.25, 0.9);
            color = a0 * texel.r * fijo;
        }

        float alpha = a0;

        // check for hover
        if (abs(v_SelectedState) > 1.5)
        {
            float mask = pow(texel.r, 1.0 / 2.2);
            alpha = mix(min(1.0, 2.0 * alpha), alpha, mask);
            // ICONOS-MOD: el contorno en hover toma el color de equipo reforzado en vez de blanco.
            color = mix(a0 * clamp(v_ColorPrimary.rgb * 1.4, 0.0, 1.0), color, mask);
        }

        out_FragColor = vec4(color, alpha * v_ColorPrimary.a);
    }
}
