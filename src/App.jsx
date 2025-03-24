import { useState, useEffect } from 'react'
import './App.css'
import jsonfile from './data.json'

function App() {
  const [jsonData, setJsonData] = useState(null)
  const [selectedValues, setSelectedValues] = useState({})
  const [data, setData] = useState(null)

  useEffect(() => {
    setJsonData(jsonfile)
  }, [])

  useEffect(() => {
    if (jsonData) {
      const initialSelectedValues = {}

      Object.entries(jsonData).forEach(([category, subcategories]) => {
        const firstSubcategory = Object.keys(subcategories)[0]
        initialSelectedValues[category] = firstSubcategory
      })

      setSelectedValues(initialSelectedValues)
    }
  }, [jsonData])

  const mergeSubcategoryValues = (selectedValues, jsonData) => {
    let mergedData = {}
    let count = {}

    Object.entries(selectedValues).forEach(([category, subcategory]) => {
      if (jsonData[category] && jsonData[category][subcategory]) {
        Object.entries(jsonData[category][subcategory]).forEach(([key, value]) => {
          if (!mergedData[key]) {
            mergedData[key] = 0
            count[key] = 0
          }

          mergedData[key] += value
          count[key] += 1
        })
      }
    })

    Object.keys(mergedData).forEach((key) => {
      mergedData[key] = mergedData[key] / count[key]
    })

    return mergedData
  }

  const changeCategory = (event) => {
    const { id, value } = event.target

    setSelectedValues((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  useEffect(() => {
    if (jsonData && selectedValues) {
      const mergedData = mergeSubcategoryValues(selectedValues, jsonData)
      setData(mergedData)
    }

  }, [selectedValues])

  return (
    <>
      <div className='title'>
        <h1>Racket Lab</h1>
      </div>
      {jsonData && (
        <>
          {Object.entries(jsonData).map(([key1, value1]) => (
            <div className='selection' key={key1}>
              <h2>{key1}</h2>
              <select id={key1} onChange={(e) => changeCategory(e)}>
                {Object.entries(value1).map(([key, value]) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </>
      )}




      {data && (
        <>
          <div className='results'>
            <h2>Résultats : </h2>
            {Object.entries(data).map(([key, value]) => (
              <h3 key={key}>{key} : <div className='resultvalue'>{" " + value.toFixed(1)}</div></h3>
            ))}

          </div>
        </>
      )}

    </>
  )
}

export default App
