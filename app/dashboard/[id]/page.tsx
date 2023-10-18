
import Wrapper from '../wrapper';


export default async function Home({ params }: { params: { id: string } }) {

    return (
        <Wrapper parent_id={params.id}/>
    )
}



