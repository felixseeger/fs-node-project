import React, { useState, useEffect, FC, CSSProperties } from 'react';
import ScrambleText from './ScrambleText';

interface ScrambledHeroTextProps {
    phrases?: string[];
    interval?: number;
    className?: string;
    style?: CSSProperties;
}

/**
 * ScrambledHeroText - Cycles through a list of phrases using the ScrambleText effect.
 * Perfect for hero headlines that need to feel dynamic and tech-focused.
 */
const ScrambledHeroText: FC<ScrambledHeroTextProps> = ({ 
    phrases = ["Drag.", "Connect.", "Deploy."],
    interval = 3500,
    className = "",
    style = {}
}) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % phrases.length);
        }, interval);

        return () => clearInterval(timer);
    }, [phrases.length, interval]);

    return (
        <div className={`scrambled-hero-text ${className}`} style={style}>
            <ScrambleText 
                text={phrases[index]} 
                trigger={true}
                // Small delay to prevent immediate scramble on initial mount
                delay={500}
            />
        </div>
    );
};

export default ScrambledHeroText;
