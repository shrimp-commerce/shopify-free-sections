Folgenden Code an die entsprechende Stelle in main-product.liquid einfügen

 {%- when 'coupon-copy' -%}
    {% render 'coupon-code', block: block, section: section %}
     

          und


{
      "type": "coupon-copy",
      "name": "Coupon Code by Coroyo",
      "settings": [
        {
          "type": "select",
          "id": "design",
          "label": "Design",
          "default": "1",
          "options": [
            {"label": "1", "value": "1"},
            {"label": "2", "value": "2"}
          ]
        },
        {
          "type": "text",
          "id": "headline",
          "label": "Headline",
          "default": "Special Offer"
        },
        {
          "type": "text",
          "id": "text",
          "label": "Text",
          "default": "Use the following coupon code to get a discount on your next purchase."
        },
        {
          "type": "select",
          "label": "Text alignment",
          "id": "text_alignment",
          "options": [
            { "value": "left", "label": "left" },
            { "value": "center", "label": "center" },
            { "value": "right", "label": "right" }
          ],
          "default": "center"
        },
        {
          "type": "text",
          "id": "coupon_code",
          "label": "Coupon Code",
          "default": "SAVE10"
        },
        {
          "type": "range",
          "id": "coupon_percentage",
          "label": "Coupon Percentage",
          "default": 10,
          "min": 0,
          "max": 100
        },
        {
          "type": "text",
          "id": "copy_text",
          "label": "Copying successful text",
          "default": "Copied!"
        },
        {
          "type": "color",
          "id": "background_color",
          "label": "Background Color",
          "default": "#f9f9f9"
        },
        {
          "type": "color",
          "id": "border_color",
          "label": "Border Color",
          "default": "#cccccc"
        },
        {
          "type": "range",
          "id": "border_size",
          "label": "Border Size",
          "default": 4,
          "min": 0,
          "max": 12,
          "unit": "px"
        },
      ]
    }

