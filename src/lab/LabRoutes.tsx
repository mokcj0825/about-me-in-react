import React from "react";
import { Route, Routes } from "react-router-dom";
import WebGLIntegration from "./experiments/webgl/WebGLIntegration";
import StereoLayer from "./experiments/webgl/StereoLayer";
import GameTheaterv1 from "./experiments/gamev1/GameTheaterv1";
import GameTheaterv1_1 from "./experiments/gamev1_1/GameTheaterv1_1";
import GameTheaterv1_2 from "./experiments/gamev1_2/GameTheaterv1_2";
import GameTheaterv1_3 from "./experiments/gamev1_3/GameTheaterv1_3";
import GameTheaterv1_4 from "./experiments/gamev1_4/GameTheaterv1_4";
import DptTheater from "./experiments/dpt/DptTheater";
import EditorTheater from "./experiments/dptEditor/EditorTheater";
import Core from "./gameCore/Core";
import { useParams } from "react-router-dom";
import {ChatCore} from "./experiments/chat/ChatCore";
import StringTest from "./strings/StringTest";
import NpmLab from "./experiments/npmTest/NpmLab";
import Race from "./race/Race";
import Cthulhu from "./cthulhu/Cthulhu";

// Constants for configuration
const DEFAULT_ROUTE_CONFIG = {
  STAGE_ID: "0001",
  DIALOG_ID: "0000",
} as const;

const CoreWrapper = () => {
  const { stageId = DEFAULT_ROUTE_CONFIG.STAGE_ID } = useParams(); // Default to configured value if no stageId provided
  return <Core stageId={stageId} />;
};

const ChatRedirector = () => {
  const { dialogScriptId = DEFAULT_ROUTE_CONFIG.DIALOG_ID } = useParams();
  return <ChatCore dialogScriptId={dialogScriptId} />;
}

const LabRoutes = () => {
  return (
    <Routes>
      <Route path="/web-gl-integration" element={<WebGLIntegration />} />
      <Route path="/three-stereo" element={<StereoLayer />} />
      <Route path="/game-theater-v1" element={<GameTheaterv1 />} />
      <Route path="/game-theater-v1_1" element={<GameTheaterv1_1 />} />
      <Route path="/game-theater-v1_2" element={<GameTheaterv1_2 />} />
      <Route path="/game-theater-v1_3" element={<GameTheaterv1_3 />} />
      <Route path="/game-theater-v1_4" element={<GameTheaterv1_4 />} />
      <Route path="/dpt" element={<DptTheater />} />
      <Route path="/dpt-editor" element={<EditorTheater />} />
      <Route path="/core/:stageId?" element={<CoreWrapper />} />
      <Route path="/chat/:dialogScriptId?" element={<ChatRedirector />} />
      <Route path="/strings" element={<StringTest />} />
      <Route path="/npmLab" element={<NpmLab />} />
      <Route path="/race" element={<Race />} />
      <Route path="/cthulhu" element={<Cthulhu />} />
    </Routes>
  );
};

export default LabRoutes;
