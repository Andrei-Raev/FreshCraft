# from PIL import Image
import imageio
#
#


from PIL import Image


def extract_alpha_channel(input_image_path, output_image_path):
    # Открываем изображение
    img = Image.open(input_image_path)

    # Проверяем, содержит ли изображение альфа-канал
    if img.mode in ('RGBA', 'LA') or True:
        print(img.mode)
        # Извлекаем альфа-канал
        alpha = img.split()[-1]

        # Сохраняем альфа-канал как отдельное изображение
        alpha.save(output_image_path)
        return True
    else:
        print("Изображение не содержит альфа-канал")
        return False


def create_gif(image_path, grid_size, output_path, duration=0.2):
    # Открываем изображение
    image = Image.open(image_path).convert("RGBA")
    width, height = image.size

    # Размер одного тайла
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

    # Сохраняем gif
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=int(duration * 1000),
        loop=0
    )


# Пример использования
input_image_path = 'static/models/cuteSceen/campfire_fire.png'
output_image_path = 'static/models/cuteSceen/campfire_fire_a.png'
success = extract_alpha_channel(input_image_path, output_image_path)

if success:
    print(f"Альфа-канал сохранен в {output_image_path}")
else:
    print("Не удалось извлечь альфа-канал")

# Пример использования
create_gif("static/models/cuteSceen/campfire_fire_a.png", (1, 4), "static/models/cuteSceen/campfire_fire_a.png")
