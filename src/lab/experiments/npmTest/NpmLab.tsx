import {Draggable, DraggableFrame} from "react-draggable-frame";

const NpmLab = () => {
  return (
      <div>
          <DraggableFrame id={"0001"} anchored={true} >
              <div onClick={() => {
                  alert('Clicked');
              }}>Hello</div>
          </DraggableFrame>

          <DraggableFrame id={"0002"} defaultPosition={{x: 20, y: 40}} anchored={true} >
              <div>Hello 2</div>
          </DraggableFrame>
      </div>
  )
}

export default NpmLab;