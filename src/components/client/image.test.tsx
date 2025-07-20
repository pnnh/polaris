/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import {PSImage} from "@/components/client/image";

describe('PSImage', () => {
    it('renders a img', () => {
        const imgSrc = '/abc.jpg'
        const imgAlt = 'test image'
        render(<PSImage src={imgSrc} alt={imgAlt} />)

        const imgTag = screen.getByAltText(imgAlt)

        expect(imgTag).toBeInTheDocument()
        expect(imgTag).toHaveAttribute('src', imgSrc)
    })
})