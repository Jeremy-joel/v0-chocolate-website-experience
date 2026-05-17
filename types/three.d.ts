import type { Object3DNode } from "@react-three/fiber"
import type { Fog } from "three"

declare module "@react-three/fiber" {
  interface ThreeElements {
    fog: Object3DNode<Fog, typeof Fog>
  }
}
