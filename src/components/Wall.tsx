import { Suspense, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls, Environment } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

// 將模型獨立成子元件
function Model() {
  const gltf_stone = useLoader(GLTFLoader, '/stone_wall.glb');
  return (
    <>
      <primitive object={gltf_stone.scene} />
    </>
  );
}

// 燈光組件
function Lights() {
  return (
    <>
      {/* 1. 環境光 */}
      <ambientLight intensity={0.4} />

      {/* 2. 平行光 */}
      <directionalLight position={[0, 15, 20]} intensity={6} color="#FFFFFF" castShadow />
      <directionalLight position={[0, 20, -30]} intensity={10} color="#FFFFFF" castShadow />
      <directionalLight position={[20, 15, 5]} intensity={2} color="#FFFFFF" castShadow />
      <directionalLight position={[-20, 15, 5]} intensity={2} color="#FFFFFF" castShadow />

      {/* 3. 環境反射 */}
      <Environment preset="city" background={false} backgroundBlurriness={5} environmentIntensity={0.05} />
    </>
  );
}

export default function CrownCork() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 建立一個狀態來決定目前是否為手機板（預設為 false 避免 SSR 報錯）
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 元件掛載時先執行一次
    handleResize();

    // 監聽視窗大小改變
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas
        style={{ width: '100vw', height: '100vh' }}

        // 根據 isMobile 三元運算子動態切換相機位置與視野角度
        camera={{
          position: isMobile ? [0, 0, 15] : [0, 0, 15],
          fov: isMobile ? 65 : 40,
        }}
        gl={{
          alpha: true,
          antialias: true
        }}
      >
        {/* 載入燈光 */}
        <Lights />

        {/* 將 Suspense 包裹剛剛建立的 Model 元件 */}
        <Suspense fallback={null}>
          <Model />
        </Suspense>

        {/* 控制器 */}
        <OrbitControls
          makeDefault // 設定為預設控制器
          enableZoom={false} // 縮放
          enablePan={false} // 平移
          enableRotate={false} // 旋轉

          // 目的地/焦點位置
          target={[0, 0, 0]} // 相機旋轉與縮放的中心點
        />

        {/* 後製效果 */}
        <EffectComposer>
          {/* 亮度閾值、亮度平滑度、效果高度 */}
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            mipmapBlur
            levels={6}
          />
        </EffectComposer>

      </Canvas>

    </div>
  );
}