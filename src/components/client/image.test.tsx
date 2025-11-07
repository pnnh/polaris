import {expect, test} from 'vitest'
import {render, screen} from '@testing-library/react'
import {PSImage} from "@/components/client/image";

test('renders a img', () => {
    const imgSrc = 'http://localhost:3000/abc.jpg'
    const imgAlt = 'test image'
    render(<PSImage src={imgSrc} alt={imgAlt}/>)

    const imgTag = screen.getByAltText(imgAlt)

    expect(imgTag).toBeDefined()
    expect(imgTag).toHaveProperty('src', imgSrc)
})
