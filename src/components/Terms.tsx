import { Modal, Typography,Box,Button, Grid } from "@mui/material"
import { Container } from "@mui/system"
import { useState } from "react"
import { LoadingButton } from "@mui/lab";
import { UserType } from "../../utils/types";
import { useUser } from '@auth0/nextjs-auth0/client';

const USER_AGREEMENT_TITLE = "Villkor för bruk & GDPR"
const USER_AGREEMENT_TEXT_1 = "Välkommen till Lunds Nations tvättbokningssystem, snabb informativ text om basala regler. snabb informativ text om basala reglersnabb informativ text om basala reglersnabb informativ text om basala reglersnabb informativ text om basala reglersnabb informativ text om basala reglersnabb informativ text om basala regler"
const USER_AGREEMENT_TEXT_2 = "För att använda systemet måste du godkänna att vi sparar följande personuppgifter: namn, telefonnummer, lägenhetsnummer och e-post i våra system. För att öka transparensen visar systemet andra hyrestagares kontaktuppgifter, ifall tvätt skulle vara kvarlämnad eller dyliktkan användare på eget initiativ kontakta varandra. Vi understryker att hålla god ton gentemot andra hyresgäster och ifall det framkommer att funktionen inte fungerar som avsett, kommer den att inaktiveras. Accepterar du följande?"

const style = {
    position: "relative",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    };

interface props{
    user: UserType
}

export const Terms = (props:props) => {
    const {user} = props
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = (event : any, reason : any) => {
        if(reason && reason == "backdropClick") {
            return;
        }
        setOpen(false)
    }
    const handleAccept = async () => {
        setLoading(true)
        const response = await fetch("/api/auth/accepted")
        if(response.ok){
            setLoading(false)
            window.location.reload()
            return
        }
        setLoading(false)
    }
    return (
        <div>
            {user?.app_metadata?.acceptedTerms ? null :   
        <Modal 
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableEscapeKeyDown
            sx={{overflow:"scroll"}}
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                {USER_AGREEMENT_TITLE}
            </Typography>
            <Typography id="modal-modal-descriptio1" variant="body1" sx={{ mt: 2 }}>
                {USER_AGREEMENT_TEXT_1}
            </Typography>
            <Typography id="modal-modal-description2" variant="body1" sx={{ mt: 2 }}>
                {USER_AGREEMENT_TEXT_2}
            </Typography>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                <Grid item xs="auto" >
                    <Button href="api/auth/logout" color="warning" variant="contained" >Avböj</Button>
                </Grid> 
                <Grid item xs="auto">   
                    <LoadingButton loading={loading} variant="contained" onClick={handleAccept}>Acceptera</LoadingButton>
                </Grid>
            </Grid>
            
            </Box>
        </Modal>
        }
        </div>
    );
    }
export default Terms

