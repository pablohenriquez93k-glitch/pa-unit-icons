#version 140

// unit_ring_selection.fs

uniform vec4 Time;
#define pi 3.1415926535
in float v_IconosRingCode;
in vec4 v_Color;
in vec2 v_TexCoord;
in float v_PixelScale;

out vec4 out_FragColor;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


void main() 
{
    float black_edge_pixel_width = 2.0;

    float ring_thickness_base = mix(0.1, 0.03, clamp(v_Color.b / 80.0, 0.0, 1.0));

 	vec2 dxy = 2.0 * v_TexCoord.xy - 1.0;
    float d = sqrt(dot(dxy, dxy));

    float radius_in_pixels = 1.0 / (v_PixelScale / (v_Color.b * 0.5 + 2.0 * v_PixelScale));
    float pixel_d = clamp(1.0 - d, 0.0, 1.0) * radius_in_pixels;

    float black_edge = clamp(pixel_d - black_edge_pixel_width, 0.0, 1.0);
    float outside_ring_edge = clamp(pixel_d / black_edge_pixel_width, 0.0, 1.0);
    float inside_ring_edge = 1.0 - smoothstep(0.0, 1.0, ((pixel_d - black_edge_pixel_width - max(2.0, radius_in_pixels * ring_thickness_base)) + 0.5) * 0.25);
    float inside_falloff = smoothstep(0.0, 1.0, (pixel_d - black_edge_pixel_width) / (radius_in_pixels * 0.45));

    float alpha = mix(0.25, 1.0, black_edge) * outside_ring_edge * mix(pow(1.0 - inside_falloff, 4.0) * 0.5, 1.0, inside_ring_edge) * 0.8;
    vec3 color = mix(vec3(0.0), vec3(0.0, 0.702, 1.0), black_edge);
    color = mix(color, vec3(0.102, 0.733, 1.0), inside_falloff);
    // Variante arcoíris adaptada de Rainbow Circle Ring, dom314 (crédito en README).
    if (v_IconosRingCode >= 8.0) {
        float angle = atan(dxy.y, dxy.x);
        color = mix(vec3(0.0), hsv2rgb(vec3(Time.x / 10.0 + angle / 2.0 / pi, 1.0, 1.0)), black_edge);
        color = mix(color, vec3(0.102, 0.733, 1.0), inside_falloff);
    }
    out_FragColor = vec4(color, alpha);
}