from PIL import Image

def remove_background(input_path, output_path, tolerance=220):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Check if the pixel is white or close to white
        # item is (R, G, B, A)
        if item[0] > tolerance and item[1] > tolerance and item[2] > tolerance:
            # Change to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

remove_background("logo.png", "logo.png")
