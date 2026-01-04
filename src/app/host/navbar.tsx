'use client'
import React from 'react'
import Button from "@mui/material/Button";

export function HostNavbar() {
    return <div>
        <Button onClick={() => {
            window.history.back()
        }}>回退</Button>
        <Button onClick={() => {
            window.history.forward()
        }}>前进</Button>
    </div>
}
