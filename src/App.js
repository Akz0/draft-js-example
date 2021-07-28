import React, { useEffect, useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import './Editor.css'
import { isNumber } from 'lodash';

const EditorStyle = {
    border: '1px solid rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    minHeight: '300px',
    cursor: 'text',
}

const CustomStyleMap = {
    'STRIKETHROUGH': {
        textDecoration: 'line-through',
    },
    'NORMAL': {
        textDecoration: 'none',
    },
    'CODE': {
        color: 'pink'
    }
}
const App = props => {

    // const value = `And don’t hesitate to ask candid questions on a first date. In today’s dating world, it’s tempting to try and play it cool by avoiding questions about whether someone’s looking for a legit relationship or just a casual fling. You don’t want to scare them off, right? Or be too serious, no? But if what you really want is a long-term relationship or more, then you want to know up front. Someone whose desires align with yours won’t run away scared. And good riddance to those who do: You didn’t waste your time or risk breaking your heart.`

    const [message, setMessage] = useState('')
    const [strikethrough, setStrikeThrough] = useState(false)
    const [align, setAlign] = useState('left')
    // const [fontSize, setFontSize] = useState(14)
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
    const [stylingButtons, setStylingButton] = useState({
        bold: false,
        italic: false,
        strike: false
    })

    const clearMessage = () => {
        setTimeout(() => {
            setMessage('')
        }, 3000)
    }
    //Change Editor State
    const onEditorChange = (editorState) => {
        setEditorState(editorState)
        setMessage('Editor State Changed')
        clearMessage()
        console.log('Editor State Change ')
    }
    const editorRef = React.useRef(null)
    const focusEditor = () => {
        editorRef.current.focus()
        clearMessage()
        setMessage('Editor Focussed')
    }
    useEffect(() => {
        setTimeout(() => {
            focusEditor()
        }, 2000)
    }, [])

    //Add Stylings to Text
    const SetStyle = (style) => {
        onEditorChange(RichUtils.toggleInlineStyle(editorState, style))
    }

    const changeStylingButton = (id) => {
        const newState = { ...stylingButtons }
        newState[id] = !stylingButtons[id]
        setStylingButton(newState)
    }
    //Handle keyboard Commands
    const handleKeyCommands = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            onEditorChange(newState)
            setMessage(`Command Accepted : ${command} `)
            clearMessage()
            return 'handled'
        }
        return 'not-handled'
    }
    const togglefontSize = fontSize => {
        if(isNumber(fontSize)){
            RichUtils.toggleBlockType(editorState, fontSize);
            console.log('Font Changed')
        }
    }
    const handleStrike = () => {
        if (strikethrough) {
            SetStyle('NORMAL')
            setStrikeThrough(false)
        } else {
            SetStyle('STRIKETHROUGH')
            setStrikeThrough(true)
        }
    }

    return <React.Fragment>
        <div className="App">
            <h1>Om Lachake - Draft Js Example</h1>
            {/* Actions */}
            <div className="style-actions">
                <button className='button bold ' onClick={() => SetStyle('BOLD')}><i class="fas fa-bold"></i></button>
                <button className='button italic' onClick={() => SetStyle('ITALIC')}><i class="fas fa-italic"></i></button>
                <button className='button italic' onClick={() => SetStyle('UNDERLINE')}><i class="fas fa-underline"></i></button>
                <button className='button ' onClick={() => setAlign('left')}><i class="fas fa-align-left"></i></button>
                <button className='button ' onClick={() => setAlign('center')}><i class="fas fa-align-center"></i></button>
                <button className='button ' onClick={() => setAlign('right')}><i class="fas fa-align-right"></i></button>
                <button className='button ' onClick={handleStrike}><i class="fas fa-strikethrough"></i></button>
                <button className='button ' onClick={() => SetStyle('CODE')}><i class="fas fa-code"></i></button>
            </div>

            <div style={EditorStyle}>
                <Editor
                    ref={editorRef}
                    editorState={editorState}
                    customStyleMap={CustomStyleMap}
                    onChange={onEditorChange}
                    handleKeyCommand={handleKeyCommands}
                    textAlignment={align}
                />
                Pink Border is the Editor
            </div>
        </div>
        <p style={{ textAlign: 'center' }}>{message}</p>
    </React.Fragment>
};

export default App;
