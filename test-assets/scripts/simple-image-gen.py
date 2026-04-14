#!/usr/bin/env python3
"""Simple image generator using only built-in Python libraries."""
import os
import struct
import zlib

def create_png(width, height, color):
    """Create a minimal PNG file."""
    def make_chunk(chunk_type, data):
        chunk = chunk_type + data
        crc = struct.pack('>I', zlib.crc32(chunk) & 0xffffffff)
        return struct.pack('>I', len(data)) + chunk + crc
    
    # PNG signature
    signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr = make_chunk(b'IHDR', ihdr_data)
    
    # IDAT chunk (raw image data)
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # filter byte
        for x in range(width):
            raw_data += bytes(color)
    
    compressed = zlib.compress(raw_data)
    idat = make_chunk(b'IDAT', compressed)
    
    # IEND chunk
    iend = make_chunk(b'IEND', b'')
    
    return signature + ihdr + idat + iend

def create_jpg(width, height, color):
    """Create a minimal JPEG-like file (actually returns PNG for compatibility)."""
    # Since proper JPEG encoding is complex, return PNG with .jpg extension
    # For real test assets, install Pillow: pip3 install Pillow
    png_data = create_png(width, height, color)
    return png_data

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    images_dir = os.path.join(base_dir, 'images')
    os.makedirs(images_dir, exist_ok=True)
    
    configs = [
        ('test-small', 100, 100, (255, 0, 0)),
        ('test-medium', 640, 480, (0, 0, 255)),
        ('test-large', 1920, 1080, (0, 255, 0)),
        ('test-square', 500, 500, (255, 255, 0)),
        ('test-wide', 1280, 720, (128, 0, 128)),
        ('test-portrait', 720, 1280, (255, 165, 0)),
    ]
    
    count = 0
    for name, width, height, color in configs:
        for ext in ['png', 'jpg', 'webp']:
            filepath = os.path.join(images_dir, f'{name}.{ext}')
            png_data = create_png(width, height, color)
            
            with open(filepath, 'wb') as f:
                f.write(png_data)
            
            size_kb = os.path.getsize(filepath) / 1024
            print(f'Created {name}.{ext} ({size_kb:.2f} KB)')
            count += 1
    
    print(f'\nTotal: {count} images created in {images_dir}')

if __name__ == '__main__':
    main()
