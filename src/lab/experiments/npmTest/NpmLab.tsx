import {Draggable, DraggableFrame} from "react-draggable-frame";

const NpmLab = () => {
  return (
      <div>
          <Draggable id={"0001"} anchored={true} >
              <div onClick={() => {
                  alert('Clicked');
              }}>Hello</div>
          </Draggable>

          <Draggable id={"0002"} anchored={true} >
              <div>Hello 2</div>
          </Draggable>
      </div>
  )
}

export default NpmLab;