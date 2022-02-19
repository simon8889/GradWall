import React, { useState, useEffect, useRef, useCallback } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { useScreenshot } from "use-react-screenshot"
import download from 'downloadjs'
import GradientLinkedList from '../../GradientLinkedList.js'

import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded' 
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded'
import VignetteIcon from '@mui/icons-material/Vignette'
import GradientIcon from '@mui/icons-material/Gradient'
import BlurOnIcon from '@mui/icons-material/BlurOn'
import BlurOffIcon from '@mui/icons-material/BlurOff'
import AddIcon from '@mui/icons-material/Add'
import WallpaperIcon from '@mui/icons-material/Wallpaper'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'

import "./GradientWall.css"
import "./Animations.css"

const CSSgradientsList = new GradientLinkedList()

// switch the controls with an animation

const GradientWall = () => {
	const [ actualGradient, setActualGradient ] = useState(CSSgradientsList.getActualValue())
	const [ gradientString, setGradientString ] = useState(actualGradient.getString())
	
	const [ blurState, setBlurState] = useState(false)
	const [ colorList, setColorList ] = useState(actualGradient.getColorList())
	const [ gradientType, setGradientType ] = useState(actualGradient.getType())
	
	const [ colorMenuState, setColorMenuState ] = useState(false)
	const [ resolutionMenuState, setResolutionMenuState ] = useState(false)
	const [ showControls, setShowControls ] = useState(true)
	
	const [ resolution, setResolution ] = useState({
		width: window.screen.width, 
		height: window.screen.height
	})
	
	const [image, takeScreenShot] = useScreenshot()
	
	const colorListRef = useRef(null)
	const gradientContainerRef = useRef(null)
	const resolutionMenuRef = useRef(null)
	
	const AlwaysScrollToBottom = () => {
		const elementRef = useRef()
		useEffect(() => elementRef.current.scrollIntoView())
		return <div ref={elementRef} />
	}
	
	const useOnClickOutside = (ref, handler) => {
		useEffect(() => {
			const listener = event => {
				if (!ref.current || ref.current.contains(event.target)) return
				handler(event)
			}
			document.addEventListener("mousedown", listener)
			document.addEventListener("touchstart", listener)
			return () => {
				document.removeEventListener("mousedown", listener)
				document.removeEventListener("touchstart", listener)
			}
		}, [ref, handler])
	}
	
	useOnClickOutside(colorListRef, ()  => setColorMenuState(false))
	useOnClickOutside(resolutionMenuRef, ()  => setResolutionMenuState(false))

	useEffect(() => {
		setColorList(actualGradient.getColorList())
		setGradientType(actualGradient.getType())
		setColorMenuState(false)
	}, [actualGradient])
	
	useEffect(() => {
		setGradientString(actualGradient.getString())
	}, [actualGradient, colorList, gradientType])
	
	const updateColorList = (newColorList) => {
		setColorList(newColorList)
		actualGradient.setColorList(newColorList)
	}
	
	const handleLeft = () => {
		CSSgradientsList.prev()
		setActualGradient(CSSgradientsList.getActualValue())
	}
	
	const handleRight = () => {
		CSSgradientsList.next()
		setActualGradient(CSSgradientsList.getActualValue())
	}
	
	const handleTypeChange = () => {
		actualGradient.alternateType()
		setGradientType(actualGradient.getType())
	}
	
	const handleBlur = () => {
		setBlurState(!blurState)
	}
	
	const handleColorChange = (colorIndex, newColor) => {
		const newColorList = [...colorList]
		newColorList[colorIndex] = newColor 
		updateColorList(newColorList)
	}
	
	const addColor = () => {
		const newColorList = [...colorList]
		newColorList.push("#ffffff")
		updateColorList(newColorList)
	}
	
	const removeColor = (index) => {
		const newColorList = [...colorList]
		newColorList.splice(index, 1)
		updateColorList(newColorList)
	}

	
	const handleDownload = () => {
		const isInGap = ((10 <= resolution.width && resolution.width <= 7680) && (10 <= resolution.height) && (resolution.height <= 4320));
		const isFilled = (resolution.width !== "" && resolution.height !== "")
		if (isInGap && isFilled) {
			setResolutionMenuState(false)
			setShowControls(false)
			setTimeout(() => {
				takeScreenShot(gradientContainerRef.current)
					.then(data => download(data, gradientString.replace(/\s/g, ''), "image/png"))
					.then(() => setShowControls(true))
			}, 500)
		}
	}
	
	return (
		<div className='gradientWall' >
			<CSSTransition in={ !showControls } unmountOnExit appear enter exit timeout={200} classNames="gradient-container-animation">
				<div className='gradientWall__hideScreen' style={ { background: gradientString } }>
					{ blurState ? <div className='gradientWall__blur'></div> : <></>}
					<p>Please, Wait 🕒</p>
				</div>
			</CSSTransition>
			
			<div className='gradientWall__photo' ref={ gradientContainerRef } style={{ width: showControls === false ? `${resolution.width}px` : "100%", height: showControls === false ? `${resolution.height}px` : "100%"}}>
				<div className="gradientWall__wallContainer" >
					{ blurState ? <div className='gradientWall__blur'></div> : <></>}
					<div className="gradientWall__wall" style={ { background: gradientString } }></div>
				</div>

				
				<CSSTransition in={ showControls } unmountOnExit appear enter exit timeout={100} classNames="gradient-container-animation">
					<div className='gradientWall__controlsContainer'>
						<h1>GradWall</h1>
						
						<div className="gradientWall__gradientString" onClick={() => navigator.clipboard.writeText(gradientString)}>
							<p title={ gradientString }>{ gradientString }</p>
							<ContentCopyRoundedIcon fontSize="small" className="gradientWall__gradientStringIcon" />
						</div>
						
						<KeyboardArrowLeftRoundedIcon className="gradientWall__arrow gradientWall__arrow--left" sx={{ fontSize: 60 }} fontSize='large' onClick={ handleLeft } />
						<ChevronRightRoundedIcon className="gradientWall__arrow gradientWall__arrow--right" sx={{ fontSize: 60 }} onClick={ handleRight } />
						
						<ul className='gradientWall__edit'>
							<li onClick={ handleTypeChange }>
								<button>
									<p>{ gradientType === "linear-gradient" ? "Linear" : "Radial"}</p>
									{gradientType === "linear-gradient" ? <GradientIcon /> : <VignetteIcon />}
								</button>
							</li>
							
							<li onClick={ handleBlur }>
								<button> 
									<p> Blur: {blurState ? "On" : "Off"}</p>
									{blurState ? <BlurOnIcon /> : <BlurOffIcon />}
								</button>
							</li>
							
							<li className="gradientWall__editColorContainer" ref={ colorListRef }>
								<button className="gradientWall__colorListItem" onClick={() => setColorMenuState(!colorMenuState)}>
									<p>Colors</p>
									<PaletteRoundedIcon />
								</button>
								<CSSTransition in={ colorMenuState } unmountOnExit appear enter exit timeout={100} classNames="menu-animation">
									<div className="gradientWall__editColor">
										<ul>
											{[...Array(colorList.length).keys()].map((index) => (
												<li className="gradientWall__colorPicker" key={index}> 
													<CSSTransition in={ colorList.length > 2 } unmountOnExit appear enter exit timeout={100} classNames="remove-animation" >
														<button onClick={() => removeColor(index)} className="gradientWall__removeColor"> <HighlightOffIcon /> </button>
													</CSSTransition>
													<p>{colorList[index].toUpperCase()}</p>
													<div className="gradientWall__colorInput">
														<input  type="color" value={colorList[index]} onChange={e => handleColorChange(index, e.target.value)}/>
													</div>
													<AlwaysScrollToBottom />
												</li>
											))}
										</ul>
										<button className="gradientWall__addColor" onClick={addColor}>
											<AddIcon fontSize="large" />
										</button>
									</div>
								</CSSTransition>
							</li>
							
							<li className="gradientWall__resolutionMenuContainer" ref={ resolutionMenuRef }>
								<button onClick={() => setResolutionMenuState(!resolutionMenuState)}>
									<p>Get</p>
									<WallpaperIcon />
								</button>
								<CSSTransition in={ resolutionMenuState } unmountOnExit appear enter exit timeout={100} classNames="menu-resolution-animation">
									<div className='gradientWall__resolutionMenu'>
										<div className='gradientWall__resolutionInput'>
											<div className="gradientWall__sizeInput">
												<label htmlFor="width">Width:</label>
												<input id="width" type="number" value={ resolution.width } onChange={e => setResolution({ ...resolution, width: e.target.value })}/>
											</div>
											<div className="gradientWall__sizeInput">
												<label htmlFor="height">Height:</label>
												<input id="height" type="number" value={ resolution.height } onChange={e => setResolution({ ...resolution, height: e.target.value })}/>
											</div>
										</div>
										<button onClick={ handleDownload }>Get Image</button>
										
									</div>
								</CSSTransition>
							</li>
						</ul>
					</div>
				</CSSTransition>
			</div>
		</div>
	)
}

export default GradientWall
