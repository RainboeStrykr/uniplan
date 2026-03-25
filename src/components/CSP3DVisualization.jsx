import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Box, Sphere, Line, Trail } from '@react-three/drei'
import * as THREE from 'three'

// Variable Node Component
function VariableNode({ variable, position, isAssigned, isConflicted, domainSize, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1)
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
  })

  const color = isAssigned ? (isConflicted ? '#ef4444' : '#10b981') : '#3b82f6'
  const size = 0.3 + (domainSize * 0.05)

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[size, 16, 16]}
        onClick={() => onClick(variable)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      <Text
        position={[0, size + 0.3, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {variable}
      </Text>
      {hovered && (
        <Text
          position={[0, size + 0.6, 0]}
          fontSize={0.1}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          Domain: {domainSize}
        </Text>
      )}
    </group>
  )
}

// Constraint Edge Component
function ConstraintEdge({ start, end, isActive, strength = 1 }) {
  const points = useMemo(() => [start, end], [start, end])
  
  return (
    <Line
      points={points}
      color={isActive ? '#fbbf24' : '#6b7280'}
      lineWidth={strength * 2}
      opacity={isActive ? 0.8 : 0.3}
      transparent
    />
  )
}

// Domain Visualization Component
function DomainVisualization({ variable, domain, assignedValue, position }) {
  const barWidth = 0.1
  const barSpacing = 0.15
  const maxHeight = 2.0
  
  return (
    <group position={position}>
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.12}
        color="#60a5fa"
        anchorX="center"
        anchorY="middle"
      >
        {variable} Domain
      </Text>
      {domain.map((value, index) => {
        const isAssigned = value === assignedValue
        const height = (1 / domain.length) * maxHeight
        const x = (index - domain.length / 2) * barSpacing
        
        return (
          <Box
            key={index}
            position={[x, height / 2, 0]}
            args={[barWidth, height, barWidth]}
          >
            <meshStandardMaterial
              color={isAssigned ? '#10b981' : '#3b82f6'}
              emissive={isAssigned ? '#10b981' : '#3b82f6'}
              emissiveIntensity={isAssigned ? 0.3 : 0.1}
              metalness={0.6}
              roughness={0.4}
            />
          </Box>
        )
      })}
    </group>
  )
}

// Search Tree Node Component
function SearchTreeNode({ position, nodeData, isCurrentPath, isFailed, depth }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current && isCurrentPath) {
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.05
    }
  })

  const color = isFailed ? '#ef4444' : (isCurrentPath ? '#10b981' : '#6b7280')
  const size = Math.max(0.15, 0.3 - depth * 0.02)

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[size, 8, 8]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isCurrentPath ? 0.4 : 0.1}
          metalness={0.7}
          roughness={0.3}
        />
      </Sphere>
      {nodeData && (
        <Text
          position={[0, size + 0.2, 0]}
          fontSize={0.08}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {nodeData.variable}={nodeData.value}
        </Text>
      )}
    </group>
  )
}

// Main 3D Scene Component
function CSPScene({ currentState, conflictSet, assignments, steps, currentStepIndex }) {
  const [selectedVariable, setSelectedVariable] = useState(null)

  // Generate variable positions in a circle
  const variablePositions = useMemo(() => {
    const positions = {}
    const variables = Object.keys(conflictSet || {})
    const radius = 4
    const angleStep = (2 * Math.PI) / variables.length
    
    variables.forEach((variable, index) => {
      const angle = index * angleStep
      positions[variable] = [
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ]
    })
    
    return positions
  }, [conflictSet])

  // Generate constraint edges
  const constraintEdges = useMemo(() => {
    const edges = []
    const variables = Object.keys(conflictSet || {})
    
    // Create edges between all variables (simplified - in real CSP this would be based on actual constraints)
    for (let i = 0; i < variables.length; i++) {
      for (let j = i + 1; j < variables.length; j++) {
        edges.push({
          start: variablePositions[variables[i]],
          end: variablePositions[variables[j]],
          isActive: Math.random() > 0.7 // Random activation for demo
        })
      }
    }
    
    return edges
  }, [variablePositions, conflictSet])

  // Generate search tree positions
  const searchTreeNodes = useMemo(() => {
    const nodes = []
    const maxDepth = 5
    const branchFactor = 2
    
    for (let depth = 0; depth < maxDepth; depth++) {
      const nodesAtDepth = Math.pow(branchFactor, depth)
      const spacing = 8 / (nodesAtDepth + 1)
      
      for (let i = 0; i < nodesAtDepth; i++) {
        const x = -4 + spacing * (i + 1)
        const y = 3 - depth * 1.5
        const z = -6
        
        nodes.push({
          position: [x, y, z],
          depth,
          nodeData: depth < currentStepIndex ? {
            variable: `var${depth}`,
            value: `val${i}`
          } : null,
          isCurrentPath: depth === currentStepIndex % maxDepth,
          isFailed: Math.random() > 0.8
        })
      }
    }
    
    return nodes
  }, [currentStepIndex])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#60a5fa" />
      
      {/* Variable Nodes */}
      {Object.entries(conflictSet || {}).map(([variable, domain]) => {
        const isAssigned = assignments.some(([k, v]) => k === variable)
        const isConflicted = currentState?.action === 'backtrack' && currentState?.current_variable === variable
        
        return (
          <VariableNode
            key={variable}
            variable={variable}
            position={variablePositions[variable]}
            isAssigned={isAssigned}
            isConflicted={isConflicted}
            domainSize={domain.length}
            onClick={setSelectedVariable}
          />
        )
      })}
      
      {/* Constraint Edges */}
      {constraintEdges.map((edge, index) => (
        <ConstraintEdge
          key={index}
          start={edge.start}
          end={edge.end}
          isActive={edge.isActive}
          strength={0.5}
        />
      ))}
      
      {/* Domain Visualization for selected variable */}
      {selectedVariable && conflictSet[selectedVariable] && (
        <DomainVisualization
          variable={selectedVariable}
          domain={conflictSet[selectedVariable]}
          assignedValue={assignments.find(([k, v]) => k === selectedVariable)?.[1]}
          position={[0, 3, 0]}
        />
      )}
      
      {/* Search Tree */}
      {searchTreeNodes.map((node, index) => (
        <SearchTreeNode
          key={index}
          position={node.position}
          nodeData={node.nodeData}
          isCurrentPath={node.isCurrentPath}
          isFailed={node.isFailed}
          depth={node.depth}
        />
      ))}
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
    </>
  )
}

// Main Component
export default function CSP3DVisualization({ currentState, conflictSet, assignments, steps, currentStepIndex }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}
      >
        <CSPScene
          currentState={currentState}
          conflictSet={conflictSet}
          assignments={assignments}
          steps={steps}
          currentStepIndex={currentStepIndex}
        />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
        />
      </Canvas>
      
      {/* 3D Controls Info */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 text-xs text-slate-300">
        <div className="font-bold text-blue-400 mb-1">3D Controls</div>
        <div>• Left Click + Drag: Rotate</div>
        <div>• Right Click + Drag: Pan</div>
        <div>• Scroll: Zoom</div>
        <div>• Click nodes for details</div>
      </div>
    </div>
  )
}
