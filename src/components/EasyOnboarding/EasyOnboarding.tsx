import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Divider, Grid, Card, CardContent, Link, makeStyles } from '@material-ui/core';
import { Page, Header, Content, InfoCard, Progress, ErrorPanel } from '@backstage/core-components';
import { Assignment, Build, Computer, Work, School } from '@material-ui/icons';
import yaml from 'js-yaml';

const useStyles = makeStyles((theme) => ({
    card: {
        marginBottom: theme.spacing(3),
    },
    listItem: {
        paddingLeft: theme.spacing(2),
    },
    sectionTitle: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        marginRight: theme.spacing(1),
    },
    divider: {
        margin: `${theme.spacing(2)}px 0`,
    },
}));

interface Task {
    task: string;
    link?: string;
}

interface Checklist {
    title: string;
    tasks: Task[];
}

interface AccessItem {
    item: string;
    link?: string;
}

interface InternalSite {
    item: string;
    link?: string;
}

interface Role {
    role: string;
    checklists?: Checklist[];
    access?: AccessItem[];
}

interface Project {
    name: string;
    checklists?: Checklist[];
    access?: AccessItem[];
}

interface Organization {
    checklists?: Checklist[];
    access?: AccessItem[];
    internal_sites?: InternalSite[];
}

interface OnboardingData {
    page_header?: string;
    page_title?: string;
    organization?: Organization;
    projects?: Project[];
    roles?: Role[];
}

export const EasyOnboardingPage = () => {
    const classes = useStyles();
    const [data, setData] = useState<OnboardingData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchYamlData = async () => {
            const githubRawUrl = 'https://raw.githubusercontent.com/automationpi/backstage-plugin-csvloader/main/onboarding.yml';
            try {
                const response = await fetch(githubRawUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const yamlData = await response.text();
                const result = yaml.load(yamlData) as { onboarding: OnboardingData };
                setData(result.onboarding);
                setLoading(false);
            } catch (error) {
                console.error('Fetch error: ', error);
                setError('Failed to fetch onboarding data');
                setLoading(false);
            }
        };

        fetchYamlData();
    }, []);

    if (loading) {
        return <Progress />;
    }

    if (error) {
        return <ErrorPanel title="Error fetching data" message={error} />;
    }

    if (!data) {
        return <Typography variant="h6">No onboarding data available.</Typography>;
    }

    const renderTasks = (tasks: Task[]) => (
        <List component="div" disablePadding>
            {tasks.map((task, taskIndex) => (
                <ListItem key={taskIndex} className={classes.listItem}>
                    <ListItemText
                        primary={
                            task.link ? (
                                <Link href={task.link} target="_blank" rel="noopener">
                                    {task.task}
                                </Link>
                            ) : (
                                task.task
                            )
                        }
                    />
                </ListItem>
            ))}
        </List>
    );

    const renderAccessItems = (accessItems: AccessItem[]) => (
        <List component="div" disablePadding>
            {accessItems.map((accessItem, index) => (
                <ListItem key={index} className={classes.listItem}>
                    <ListItemText
                        primary={
                            accessItem.link ? (
                                <Link href={accessItem.link} target="_blank" rel="noopener">
                                    {accessItem.item}
                                </Link>
                            ) : (
                                accessItem.item
                            )
                        }
                    />
                </ListItem>
            ))}
        </List>
    );

    const renderInternalSites = (internalSites: InternalSite[]) => (
        <List component="div" disablePadding>
            {internalSites.map((site, index) => (
                <ListItem key={index} className={classes.listItem}>
                    <ListItemText
                        primary={
                            site.link ? (
                                <Link href={site.link} target="_blank" rel="noopener">
                                    {site.item}
                                </Link>
                            ) : (
                                site.item
                            )
                        }
                    />
                </ListItem>
            ))}
        </List>
    );

    return (
        <Page themeId="tool">
            <Header title={data.page_header || "Default Page Header"} />
            <Content>
                <Typography variant="h4" gutterBottom>{data.page_title || "Default Page Title"}</Typography>
                <Grid container spacing={3}>
                    {/* Organization Section */}
                    {data.organization && (
                        <Grid item xs={12} md={6}>
                            <InfoCard title="Organization" variant={undefined}>
                                {data.organization.checklists && (
                                    <>
                                        <Typography variant="h6" className={classes.sectionTitle}>
                                            <Assignment className={classes.icon} /> Checklists
                                        </Typography>
                                        <List>
                                            {data.organization.checklists.map((checklist, index) => (
                                                <div key={index}>
                                                    <ListItem>
                                                        <ListItemText primary={checklist.title} />
                                                    </ListItem>
                                                    {renderTasks(checklist.tasks)}
                                                    <Divider className={classes.divider} />
                                                </div>
                                            ))}
                                        </List>
                                    </>
                                )}
                                {data.organization.access && (
                                    <>
                                        <Typography variant="h6" className={classes.sectionTitle}>
                                            <Build className={classes.icon} /> Access
                                        </Typography>
                                        {renderAccessItems(data.organization.access)}
                                    </>
                                )}
                            </InfoCard>
                        </Grid>
                    )}
                    {data.organization?.internal_sites && (
                        <Grid item xs={12} md={6}>
                            <InfoCard title="Internal Sites" variant={undefined}>
                                <Typography variant="h6" className={classes.sectionTitle}>
                                    <Computer className={classes.icon} /> Internal Sites
                                </Typography>
                                {renderInternalSites(data.organization.internal_sites)}
                            </InfoCard>
                        </Grid>
                    )}

                    {/* Projects Section */}
                    {data.projects && data.projects.map((project, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card variant="outlined" className={classes.card}>
                                <CardContent>
                                    <Typography variant="h5" className={classes.sectionTitle} gutterBottom>
                                        <Work className={classes.icon} /> Project: {project.name}
                                    </Typography>
                                    {project.checklists && (
                                        <>
                                            <Typography variant="h6" className={classes.sectionTitle}>
                                                <Assignment className={classes.icon} /> Checklists
                                            </Typography>
                                            <List>
                                                {project.checklists.map((checklist, checklistIndex) => (
                                                    <div key={checklistIndex}>
                                                        <ListItem>
                                                            <ListItemText primary={checklist.title} />
                                                        </ListItem>
                                                        {renderTasks(checklist.tasks)}
                                                        <Divider className={classes.divider} />
                                                    </div>
                                                ))}
                                            </List>
                                        </>
                                    )}
                                    {project.access && (
                                        <>
                                            <Typography variant="h6" className={classes.sectionTitle}>
                                                <Build className={classes.icon} /> Access
                                            </Typography>
                                            {renderAccessItems(project.access)}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                    {/* Roles Section */}
                    {data.roles && data.roles.map((role, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card variant="outlined" className={classes.card}>
                                <CardContent>
                                    <Typography variant="h5" className={classes.sectionTitle} gutterBottom>
                                        <School className={classes.icon} /> Role: {role.role}
                                    </Typography>
                                    {role.checklists && (
                                        <>
                                            <Typography variant="h6" className={classes.sectionTitle}>
                                                <Assignment className={classes.icon} /> Checklists
                                            </Typography>
                                            <List>
                                                {role.checklists.map((checklist, checklistIndex) => (
                                                    <div key={checklistIndex}>
                                                        <ListItem>
                                                            <ListItemText primary={checklist.title} />
                                                        </ListItem>
                                                        {renderTasks(checklist.tasks)}
                                                        <Divider className={classes.divider} />
                                                    </div>
                                                ))}
                                            </List>
                                        </>
                                    )}
                                    {role.access && (
                                        <>
                                            <Typography variant="h6" className={classes.sectionTitle}>
                                                <Build className={classes.icon} /> Access
                                            </Typography>
                                            {renderAccessItems(role.access)}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Content>
        </Page>
    );
};

