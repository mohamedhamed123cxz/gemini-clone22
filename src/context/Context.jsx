import { createContext, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentprompts, setRecentprompts] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Replace with your actual Google Generative AI API key
  const apiKey = 'AIzaSyDMOnTYIlLCprlu4lNxbYwz8XkxIciDFRg';
  const genAI = new GoogleGenerativeAI(apiKey);

  const runChat = async (prompt) => {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };

      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(prompt);
      const response = result.response;
      console.log(response.text());
      return response.text();
    } catch (error) {
      console.error('Error running chat:', error);
      throw error;
    }
  };

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newchat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    try {
      let response;
      if (prompt !== undefined) {
        response = await runChat(prompt);
        setRecentprompts(prompt); // تم تحديثها لتأخذ قيمة السؤال المرسل
        setPrevPrompts((prev) => [prompt, ...prev]); // إضافة السؤال إلى قائمة الـ prevPrompts
      } else {
        setPrevPrompts((prev) => [...prev, input]);
        response = await runChat(input);
      }

      let responseArray = response.split("**");
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }

      let newResponse2 = newResponse.split("*").join("<br>");
      let newResponseArray = newResponse2.split(" ");

      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }

      setResultData(newResponse);
      setLoading(false);
      setInput(""); // تم مسح الإدخال بعد الإرسال
    } catch (error) {
      console.error('Error onSent:', error);
      setLoading(false);
      setShowResult(false);
      // Handle error as needed
    }
  };
  const ContextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentprompts,
    recentprompts,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newchat,
  };

  return (
    <Context.Provider value={ContextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
