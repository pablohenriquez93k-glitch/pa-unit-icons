#version 140

// unit_ring_hover.fs
uniform vec4 Time;

in float v_IconosRingCode;
in vec4 v_Color;
in vec2 v_TexCoord;
in float v_PixelScale;

out vec4 out_FragColor;

void main() 
{
    float black_edge_pixel_width = 2.0;

    float ring_thickness_base = mix(0.1, 0.03, clamp(v_Color.b / 80.0, 0.0, 1.0));

    vec2 anim_speed = mix(vec2(0.15, 3.3333), vec2(0.15, 3.3333) * 0.3, clamp(v_Color.b / 80.0, 0.0, 1.0));

    vec2 dxy = 2.0 * v_TexCoord.xy - 1.0;
    float d = sqrt(dot(dxy, dxy));

    float radius_in_pixels = 1.0 / (v_PixelScale / (v_Color.b * 0.5 + 2.0 * v_PixelScale));
    float pixel_d = clamp(1.0 - d, 0.0, 1.0) * radius_in_pixels;

    float selection_offset = max(2.0, radius_in_pixels * ring_thickness_base);

    float black_edge = clamp((pixel_d - black_edge_pixel_width - selection_offset), 0.0, 1.0);
    float outside_edge = clamp((pixel_d - selection_offset) / black_edge_pixel_width, 0.0, 1.0);
    float inside_ring_edge = 1.0 - smoothstep(0.0, 1.0, ((pixel_d - black_edge_pixel_width - max(2.0, radius_in_pixels * ring_thickness_base) - selection_offset) + 0.5) * 0.25);
    float inside_falloff = smoothstep(0.0, 1.0, (pixel_d - black_edge_pixel_width) / (radius_in_pixels * (0.25 + ring_thickness_base)));

    float angle_gradient = acos(normalize(dxy).x);
    if (dxy.y < 0.0)
        angle_gradient *= -1.0;

    angle_gradient = sin((angle_gradient - mod(Time.x * anim_speed.x, 1.0) * 3.141592 * 2.0) * 5.0);

    float factor_exclude = clamp((angle_gradient + 0.35 + sin(Time.x * anim_speed.y) * 0.6) * d * radius_in_pixels * 0.25, 0.0, 1.0);

    float alpha = outside_edge * mix(pow(1.0 - inside_falloff, 4.0) * 0.25, 1.0, inside_ring_edge) * factor_exclude;

    float choice = mod(v_IconosRingCode, 8.0);
    vec3 tint = vec3(1.0);
    if (choice == 1.0) tint = vec3(1.0, 0.0, 0.0);
    if (choice == 2.0) tint = vec3(1.0, 1.0, 0.0);
    if (choice == 3.0) tint = vec3(0.0, 1.0, 0.0);
    if (choice == 4.0) tint = vec3(0.0, 1.0, 1.0);
    if (choice == 5.0) tint = vec3(0.0, 0.0, 1.0);
    if (choice == 6.0) tint = vec3(1.0, 0.0, 1.0);
    if (choice == 7.0) tint = vec3(1.0, 1.0, 1.0);
    vec3 color = mix(vec3(0.05), tint, black_edge);

    out_FragColor = vec4(color, alpha * 0.85);
}