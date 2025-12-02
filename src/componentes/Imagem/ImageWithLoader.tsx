import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface ImageWithLoaderProps {
  src: string;
  alt: string;
}

const pulse = keyframes`
  0% { background-color: #e2e8f0; }
  50% { background-color: #cbd5e1; }
  100% { background-color: #e2e8f0; }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 220px;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background-color: #f1f5f9;
`;

const Skeleton = styled.div`
  width: 100%;
  height: 100%;
  animation: ${pulse} 1.5s infinite;
  position: absolute;
  top: 0; left: 0;
`;

const StyledImg = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

export const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <ImageWrapper>
      {!loaded && <Skeleton />}
      <StyledImg 
        src={src} 
        alt={alt} 
        $loaded={loaded} 
        onLoad={() => setLoaded(true)} 
      />
    </ImageWrapper>
  );
};