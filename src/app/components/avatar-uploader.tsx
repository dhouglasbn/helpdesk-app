import { Avatar, message, Upload } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import type { UploadFile, UploadProps } from "antd";
import { useState } from "react";
import type { UserData } from '../../http/types/userData'
import { env } from "../../env";
import type { RcFile } from "antd/es/upload";
import { useUpdatePicture } from "../../http/use-update-picture";

type AvatarUploaderProps = {
  user: UserData | null;
}

export function AvatarUploader({ user }: AvatarUploaderProps) {
  const { mutateAsync: updatePicture } = useUpdatePicture();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const uploadProps: UploadProps = {
    fileList,
    showUploadList: false,

    beforeUpload: async (file: RcFile) => {
      if (!user) return;
      const uploadFile: UploadFile = {
        uid: crypto.randomUUID(),
        name: file.name,
        status: "done",
        originFileObj: file,
      };

      setFileList([uploadFile]);

      await updatePicture({
        userId: user.id,
        picture: [uploadFile],
      });

      message.success("Foto de usuário atualizada!")
      return false; // impede upload automático
    },
  };

  return (
    <ImgCrop
      cropShape="round"
      modalTitle="Editar Foto de Perfil"
      modalOk="Confirmar"
      modalCancel="Cancelar"
    >
      <Upload {...uploadProps}>
        <div className="relative group w-[220px] h-[220px] cursor-pointer">

          <Avatar
            size={220}
            src={`${env.VITE_API_URL}${user?.picturePath}?t=${Date.now()}`}
          />

          {/* overlay hover */}
          <div
            className="
              absolute inset-0
              bg-black/50
              rounded-full
              flex flex-col
              items-center
              justify-center
              text-white
              opacity-0
              group-hover:opacity-100
              transition
            "
          >
            <CameraOutlined style={{ fontSize: 28 }} />
            <span className="mt-2 text-sm">Atualizar foto</span>
          </div>

        </div>
      </Upload>
    </ImgCrop>
  );
}