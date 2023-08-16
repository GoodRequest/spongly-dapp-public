const fs = require('fs')

const project = process.env.npm_config_project

try {
    fs.unlinkSync(__dirname + `/../${project}/lightTokens.json`)
} catch {
    console.log('no tokens to delete')
}

try {
    fs.unlinkSync(__dirname + `/../${project}/darkTokens.json`)
} catch {
    console.log('no tokens to delete')
}

try {
    fs.unlinkSync(__dirname + "/../../style-dictionary.js")
} catch {
    console.log('no style-dictionary.js to delete')
}

fs.symlink(__dirname + "/../style-dictionary.js",
    __dirname + '/../../style-dictionary.js', 'file', (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("\nSymlink to style-dictionary.js created");
    }
})

const lightGlobalFile = require(__dirname + `/../${project}/global.json`)
const lightThemeFile = require(__dirname + `/../${project}/light.json`)

for (const [key, value] of Object.entries(lightGlobalFile.color)) {
	lightThemeFile.color[key] = value
}

fs.writeFileSync(__dirname + `/../${project}/lightTokens.json`, JSON.stringify(lightThemeFile, null, 2), function writeJSON(err) {
    if (err)
        console.log(err)
    else
        console.log('file written succesfully')
})

const darkGlobalFile = require(__dirname + `/../${project}/global.json`)
const darkThemeFile = require(__dirname + `/../${project}/dark.json`)
for (const [key, value] of Object.entries(darkGlobalFile.color)) {
	darkThemeFile.color[key] = value
}

fs.writeFileSync(__dirname + `/../${project}/darkTokens.json`, JSON.stringify(darkThemeFile, null, 2), function writeJSON(err) {
    if (err)
        console.log(err)
    else
        console.log('file written succesfully')
})

function hexToRgb(hex) {
	const bigint = parseInt(hex.substring(1), 16)
	const r = (bigint >> 16) & 255
	const g = (bigint >> 8) & 255
	const b = bigint & 255
	return [r, g, b].join()
}

function parseColor(colorstr, theme) {
	if (colorstr.includes('rgba')) {
		const colorRef = colorstr.substring(colorstr.indexOf('{') + 1, colorstr.indexOf('}')).split('.')
		let rgb
		if (theme === 'light') {
			let lightFileColor = lightFile.color
			for (let i = 1; i < colorRef.length; i++ ) {
				lightFileColor = lightFileColor[colorRef[i]]
			}
			rgb = hexToRgb(lightFileColor.value)
		} else {
			let darkFileColor = darkFile.color
			for (let i = 1; i < colorRef.length; i++ ) {
				darkFileColor = darkFileColor[colorRef[i]]
			}
			rgb = hexToRgb(darkFileColor.value)
		}
		const opacity = colorstr.substring(colorstr.indexOf(',') + 1, colorstr.indexOf(')'))
		return `rgba(${rgb}, ${opacity})`
	} else {
		return colorstr
	}
}

function fixColors() {
	for (const [key, value] of Object.entries(lightFile.color)) {
		for (const [innerKey, innerValue] of Object.entries(value)) {
			if (innerValue?.value) {
				return
			}
			for (const [innerestKey, innerestValue] of Object.entries(innerValue)) {
				if (innerestValue?.value) {
					lightFile.color[key][innerKey][innerestKey].value = parseColor(innerestValue.value, 'light')
				} else {
					for (const [mostInnerKey, mostInnerValue] of Object.entries(innerestValue)) {
						lightFile.color[key][innerKey][innerestKey][mostInnerKey].value = parseColor(mostInnerValue.value, 'light')
					}
				}
			}
		}
	}
	for (const [key, value] of Object.entries(darkFile.color)) {
		for (const [innerKey, innerValue] of Object.entries(value)) {
			if (innerValue?.value) {
				return
			}
			for (const [innerestKey, innerestValue] of Object.entries(innerValue)) {
				if (innerestValue?.value) {
					darkFile.color[key][innerKey][innerestKey].value = parseColor(innerestValue.value, 'dark')
				} else {
					for (const [mostInnerKey, mostInnerValue] of Object.entries(innerestValue)) {
						darkFile.color[key][innerKey][innerestKey][mostInnerKey].value = parseColor(mostInnerValue.value, 'dark')
					}
				}
			}
		}
	}
}

function parseShadow(obj, theme) {
	if (Array.isArray(obj)) {
		const x1 = obj[0].x
		const y1 = obj[0].y
		const blur1 = obj[0].blur
		const spread1 = obj[0].spread
		const color1 = parseColor(obj[0].color, theme)
		const x2 = obj[1].x
		const y2 = obj[1].y
		const blur2 = obj[1].blur
		const spread2 = obj[1].spread
		const color2 = parseColor(obj[1].color, theme)
		return `${x1}px ${y1}px ${blur1}px ${spread1}px ${color1}, ${x2}px ${y2}px ${blur2}px ${spread2}px ${color2}`
	} else {
		const x = obj.x
		const y = obj.y
		const blur = obj.blur
		const spread = obj.spread
		const color = parseColor(obj.color, theme)
		return `${x}px ${y}px ${blur}px ${spread}px ${color}`
	}
}

function fixShadows() {
	for (const [key] of Object.entries(lightFile.dropShadow)) {
		lightFile.dropShadow[key].value = parseShadow(lightFile.dropShadow[key].value)
	}
	for (const [key] of Object.entries(lightFile.innerShadow)) {
		lightFile.innerShadow[key].value = parseShadow(lightFile.innerShadow[key].value)
	}
	for (const [key] of Object.entries(darkFile.dropShadow)) {
		darkFile.dropShadow[key].value = parseShadow(darkFile.dropShadow[key].value)
	}
	for (const [key] of Object.entries(darkFile.innerShadow)) {
		darkFile.innerShadow[key].value = parseShadow(darkFile.innerShadow[key].value)
	}
}

function fixRings() {
	for (const [key] of Object.entries(lightFile.ring)) {
		for (const [innerKey] of Object.entries(lightFile.ring[key])) {
			lightFile.ring[key][innerKey].value = parseShadow(lightFile.ring[key][innerKey].value, 'light')
		}
	}
	for (const [key] of Object.entries(darkFile.ring)) {
		for (const [innerKey] of Object.entries(darkFile.ring[key])) {
			darkFile.ring[key][innerKey].value = parseShadow(darkFile.ring[key][innerKey].value, 'dark')
		}
	}
}

const lightFileName = __dirname + `/../${project}/lightTokens.json`
const darkFileName = __dirname + `/../${project}/darkTokens.json`

const lightFile = require(lightFileName)
const darkFile = require(darkFileName)

fixColors()
fixShadows()
fixRings()

fs.writeFileSync(lightFileName, JSON.stringify(lightFile, null, 2), function writeJSON(err) {
    if (err)
        console.log(err)
    else
        console.log('file written succesfully')
})

fs.writeFileSync(darkFileName, JSON.stringify(darkFile, null, 2), function writeJSON(err) {
    if (err)
        console.log(err)
    else
        console.log('file written succesfully')
})
