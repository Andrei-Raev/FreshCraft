"""
This auxiliary module provides functions for image processing tasks.

The module includes functionalities to:
1. Extract the alpha channel from an image and save it separately.
2. Create an animated GIF by dividing an image into a grid of smaller images.

Usage Examples:
    - Extracting the alpha channel:
        input_image_path = 'path/to/input_image.png'
        output_image_path = 'path/to/output_alpha.png'
        success = extract_alpha_channel(input_image_path, output_image_path)

    - Creating a GIF:
        create_gif('path/to/image.png', (columns, rows), 'path/to/output.gif', duration=0.2)

Dependencies:
    - PIL (Pillow library) for image handling.
"""

from PIL import Image
from typing import Tuple


def extract_alpha_channel(input_image_path: str, output_image_path: str) -> bool:
    """
    Extracts the alpha channel from an image and saves it to a specified path.

    :param input_image_path: Path to the input image file.
    :param output_image_path: Path where the extracted alpha channel will be saved.
    :return: True if the alpha channel was successfully extracted and saved, False otherwise.
    """
    img = Image.open(input_image_path)

    if img.mode in ('RGBA', 'LA') or True:
        alpha = img.split()[-1]
        alpha.save(output_image_path)
        return True
    else:
        print("Изображение не содержит альфа-канал")
        return False


def create_gif(image_path: str, grid_size: Tuple[int, int], output_path: str, duration: float = 0.2) -> None:
    """
    Creates a GIF by splitting an image into a grid and saving as an animated GIF.

    :param image_path: Path to the image to be processed.
    :param grid_size: Tuple indicating the number of tiles horizontally and vertically.
    :param output_path: Path where the GIF will be saved.
    :param duration: Duration of each frame in the GIF in seconds.
    """
    image = Image.open(image_path).convert("RGBA")
    width, height = image.size

    tile_width = width // grid_size[0]
    tile_height = height // grid_size[1]

    frames = []
    for y in range(grid_size[1]):
        for x in range(grid_size[0]):
            left = x * tile_width
            upper = y * tile_height
            right = (x + 1) * tile_width
            lower = (y + 1) * tile_height
            tile = image.crop((left, upper, right, lower))
            frames.append(tile)

    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=int(duration * 1000),
        loop=0
    )


# Example usage
input_image_path = 'static/models/cuteSceen/campfire_fire.png'
output_image_path = 'static/models/cuteSceen/campfire_fire_a.png'
success = extract_alpha_channel(input_image_path, output_image_path)

if success:
    print(f"Альфа-канал сохранен в {output_image_path}")
else:
    print("Не удалось извлечь альфа-канал")

# Example usage
create_gif("static/models/cuteSceen/campfire_fire_a.png", (1, 4), "static/models/cuteSceen/campfire_fire_a.png")
