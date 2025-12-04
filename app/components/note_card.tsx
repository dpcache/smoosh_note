import { Card, CardContent, Typography, SxProps, Theme } from "@mui/material";

interface Note {
  title: string;
  content: string;
}

interface NoteCardProps {
  note: Note;
  sx?: SxProps<Theme>;
}

export default function NoteCard({
  note,
  sx,
}: NoteCardProps) {

  const cardSx: SxProps<Theme> = {
    // Keep the size and styling similar to your original component's Card
    width: 200,
    height: 300,
    display: "flex",
    flexDirection: "column", // Use column layout for title/content
    borderRadius: 2,
    boxShadow: 3, // Slightly higher shadow for visual separation
    p: 0,
    m: 0,
    // Add custom styles from props
    ...sx,
  };

  return (
    <Card sx={cardSx} elevation={2}>
      <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          noWrap // Prevents the title from wrapping
          title={note.title} // Tooltip for full title
          sx={{ fontWeight: 'bold' }}
        >
          {note.title}
        </Typography>

        {/* Content Section */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            // Limit content to the available card space
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            // Adjust the number of lines to show based on design preference
            WebkitLineClamp: 10,
            whiteSpace: 'pre-wrap', // Respects line breaks in content
          }}
        >
          {note.content}
        </Typography>
      </CardContent>
    </Card>
  );
}