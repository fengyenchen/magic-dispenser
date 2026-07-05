import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog"

export default function LogoutDialog({ trigger }: { trigger: React.ReactNode }) {
    const auth = useContext(AuthContext);

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                {trigger}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>確定要登出嗎？</AlertDialogTitle>
                    <AlertDialogDescription>
                        登出後需要重新登入，請確認是否要登出。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        取消
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => auth?.logout()}
                    >
                        確定
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}