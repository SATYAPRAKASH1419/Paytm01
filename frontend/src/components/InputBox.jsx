export function InputBox({label,placeholder,onChange,value}){
    return <div>
        <div className="text-sm font-medium text-left py-2">{label}</div>
        <input type="text" onChange ={onChange} value={value} placeholder={placeholder} className="mt-1 w-full px-3 py-2 border border-gray-500 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-blue-950 focus:border-black  ocus:ring-blue-500"/>
    </div>
}